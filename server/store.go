package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sync"
)

type Reservation struct {
	ID         string `json:"id"`
	FacilityID string `json:"facilityId"`
	DriverName string `json:"driverName"`
}

var (
	ErrFacilityAlreadyReserved = errors.New("facility already reserved")
	ErrReservationNotFound     = errors.New("reservation not found")
)

// ReservationStore keeps reservations in memory and mirrors every change to a JSON file.
type ReservationStore struct {
	mutex        sync.Mutex
	filePath     string
	reservations []Reservation
}

func NewReservationStore(filePath string) (*ReservationStore, error) {
	store := &ReservationStore{filePath: filePath, reservations: []Reservation{}}

	contents, err := os.ReadFile(filePath)
	if errors.Is(err, os.ErrNotExist) {
		return store, nil
	}
	if err != nil {
		return nil, err
	}
	if len(contents) == 0 {
		return store, nil
	}
	if err := json.Unmarshal(contents, &store.reservations); err != nil {
		return nil, err
	}
	return store, nil
}

func (store *ReservationStore) List() []Reservation {
	store.mutex.Lock()
	defer store.mutex.Unlock()

	copied := make([]Reservation, len(store.reservations))
	copy(copied, store.reservations)
	return copied
}

func (store *ReservationStore) Create(facilityID string, driverName string) (Reservation, error) {
	store.mutex.Lock()
	defer store.mutex.Unlock()

	for _, existing := range store.reservations {
		if existing.FacilityID == facilityID {
			return Reservation{}, ErrFacilityAlreadyReserved
		}
	}

	id, err := generateID()
	if err != nil {
		return Reservation{}, err
	}

	reservation := Reservation{ID: id, FacilityID: facilityID, DriverName: driverName}
	updated := append(store.reservations, reservation)
	if err := store.save(updated); err != nil {
		return Reservation{}, err
	}
	store.reservations = updated
	return reservation, nil
}

func (store *ReservationStore) Delete(id string) error {
	store.mutex.Lock()
	defer store.mutex.Unlock()

	updated := make([]Reservation, 0, len(store.reservations))
	found := false
	for _, existing := range store.reservations {
		if existing.ID == id {
			found = true
			continue
		}
		updated = append(updated, existing)
	}
	if !found {
		return ErrReservationNotFound
	}

	if err := store.save(updated); err != nil {
		return err
	}
	store.reservations = updated
	return nil
}

// save writes to a temp file first and renames it, so a crash mid-write never leaves a corrupt file.
func (store *ReservationStore) save(reservations []Reservation) error {
	contents, err := json.MarshalIndent(reservations, "", "  ")
	if err != nil {
		return err
	}

	tempFile, err := os.CreateTemp(filepath.Dir(store.filePath), "reservations-*.json")
	if err != nil {
		return err
	}
	defer os.Remove(tempFile.Name())

	if _, err := tempFile.Write(contents); err != nil {
		tempFile.Close()
		return err
	}
	if err := tempFile.Close(); err != nil {
		return err
	}
	return os.Rename(tempFile.Name(), store.filePath)
}

func generateID() (string, error) {
	randomBytes := make([]byte, 8)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(randomBytes), nil
}
