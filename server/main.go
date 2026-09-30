package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

const (
	listenAddress = ":8080"
	dataFilePath  = "reservations.json"
)

func main() {
	store, err := NewReservationStore(dataFilePath)
	if err != nil {
		log.Fatalf("load reservations: %v", err)
	}
	handlers := &ReservationHandlers{store: store}

	router := http.NewServeMux()
	router.HandleFunc("GET /api/reservations", handlers.List)
	router.HandleFunc("POST /api/reservations", handlers.Create)
	router.HandleFunc("DELETE /api/reservations/{id}", handlers.Delete)

	log.Printf("reservation server listening on %s", listenAddress)
	log.Fatal(http.ListenAndServe(listenAddress, withDelay(router, readDelay())))
}

// readDelay reads DELAY_MS so pending states in the UI can be tested with artificial latency.
func readDelay() time.Duration {
	rawDelay := os.Getenv("DELAY_MS")
	if rawDelay == "" {
		return 0
	}
	milliseconds, err := strconv.Atoi(rawDelay)
	if err != nil || milliseconds < 0 {
		log.Fatalf("DELAY_MS must be a non-negative integer, got %q", rawDelay)
	}
	log.Printf("delaying every request by %dms", milliseconds)
	return time.Duration(milliseconds) * time.Millisecond
}

func withDelay(next http.Handler, delay time.Duration) http.Handler {
	if delay == 0 {
		return next
	}
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		time.Sleep(delay)
		next.ServeHTTP(writer, request)
	})
}
