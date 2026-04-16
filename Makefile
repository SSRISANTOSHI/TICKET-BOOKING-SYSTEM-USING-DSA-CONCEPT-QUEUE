CC=gcc
CFLAGS=-Wall -Wextra -std=c99

booking: booking.c
	$(CC) $(CFLAGS) -o booking booking.c

clean:
	rm -f booking flight_bookings.txt

run: booking
	./booking

web:
	@echo "Starting web server..."
	@echo "Open http://localhost:8000 in your browser"
	python3 -m http.server 8000