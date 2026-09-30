package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
)

type createReservationRequest struct {
	FacilityID string `json:"facilityId"`
	DriverName string `json:"driverName"`
}

type ReservationHandlers struct {
	store *ReservationStore
}

func (handlers *ReservationHandlers) List(writer http.ResponseWriter, request *http.Request) {
	writeJSON(writer, http.StatusOK, handlers.store.List())
}

func (handlers *ReservationHandlers) Create(writer http.ResponseWriter, request *http.Request) {
	var body createReservationRequest
	if err := json.NewDecoder(request.Body).Decode(&body); err != nil {
		writeError(writer, http.StatusBadRequest, "invalid JSON body")
		return
	}

	facilityID := strings.TrimSpace(body.FacilityID)
	driverName := strings.TrimSpace(body.DriverName)
	if facilityID == "" || driverName == "" {
		writeError(writer, http.StatusBadRequest, "facilityId and driverName are required")
		return
	}

	reservation, err := handlers.store.Create(facilityID, driverName)
	if errors.Is(err, ErrFacilityAlreadyReserved) {
		writeError(writer, http.StatusConflict, err.Error())
		return
	}
	if err != nil {
		log.Printf("create reservation: %v", err)
		writeError(writer, http.StatusInternalServerError, "could not save reservation")
		return
	}

	writeJSON(writer, http.StatusCreated, reservation)
}

func (handlers *ReservationHandlers) Delete(writer http.ResponseWriter, request *http.Request) {
	err := handlers.store.Delete(request.PathValue("id"))
	if errors.Is(err, ErrReservationNotFound) {
		writeError(writer, http.StatusNotFound, err.Error())
		return
	}
	if err != nil {
		log.Printf("delete reservation: %v", err)
		writeError(writer, http.StatusInternalServerError, "could not delete reservation")
		return
	}

	writer.WriteHeader(http.StatusNoContent)
}

func writeJSON(writer http.ResponseWriter, status int, value any) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	if err := json.NewEncoder(writer).Encode(value); err != nil {
		log.Printf("write response: %v", err)
	}
}

func writeError(writer http.ResponseWriter, status int, message string) {
	writeJSON(writer, status, map[string]string{"error": message})
}
