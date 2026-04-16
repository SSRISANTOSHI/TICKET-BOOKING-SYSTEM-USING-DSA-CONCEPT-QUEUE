#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_SIZE 100
#define MAX_NAME 50
#define MAX_FLIGHTS 50

typedef struct {
    char flight_number[20];
    char from_city[MAX_NAME];
    char to_city[MAX_NAME];
    char timing[10];
    float base_price;
} FlightInfo;

typedef struct {
    int flight_id;
    char passenger_name[MAX_NAME];
    char from_city[MAX_NAME];
    char to_city[MAX_NAME];
    char flight_number[20];
    char timing[10];
    char seat_class[20];
    char booking_date[15];
    float price;
} FlightBooking;

typedef struct {
    FlightBooking data[MAX_SIZE];
    int front, rear;
} FlightQueue;

FlightInfo flights_db[MAX_FLIGHTS];
int total_flights = 0;

void initQueue(FlightQueue *q) {
    q->front = q->rear = -1;
}

int isEmpty(FlightQueue *q) {
    return q->front == -1;
}

int isFull(FlightQueue *q) {
    return (q->rear + 1) % MAX_SIZE == q->front;
}

void loadFlightDatabase() {
    FILE *file = fopen("flights_db.txt", "r");
    if (!file) {
        printf("Flight database not found!\n");
        return;
    }
    
    total_flights = 0;
    while (fscanf(file, "%19[^,],%49[^,],%49[^,],%9[^,],%f\n",
                  flights_db[total_flights].flight_number,
                  flights_db[total_flights].from_city,
                  flights_db[total_flights].to_city,
                  flights_db[total_flights].timing,
                  &flights_db[total_flights].base_price) == 5) {
        total_flights++;
    }
    fclose(file);
    printf("Loaded %d flights from database\n", total_flights);
}

float calculatePrice(char *flight_num, char *from, char *to, char *class) {
    for (int i = 0; i < total_flights; i++) {
        if (strcmp(flights_db[i].flight_number, flight_num) == 0 &&
            strcmp(flights_db[i].from_city, from) == 0 &&
            strcmp(flights_db[i].to_city, to) == 0) {
            
            float price = flights_db[i].base_price;
            if (strcmp(class, "Business") == 0) price *= 2.5;
            else if (strcmp(class, "First") == 0) price *= 4.0;
            
            return price;
        }
    }
    return 0.0;
}

void displayAvailableFlights() {
    printf("\nAvailable Flights:\n");
    printf("%-10s %-12s %-12s %-8s %-8s\n", "Flight", "From", "To", "Time", "Price");
    printf("--------------------------------------------------\n");
    for (int i = 0; i < total_flights; i++) {
        printf("%-10s %-12s %-12s %-8s $%-7.2f\n",
               flights_db[i].flight_number, flights_db[i].from_city,
               flights_db[i].to_city, flights_db[i].timing, flights_db[i].base_price);
    }
}

void enqueue(FlightQueue *q, FlightBooking booking) {
    if (isFull(q)) {
        printf("Flight booking queue is full!\n");
        return;
    }
    if (isEmpty(q)) q->front = 0;
    q->rear = (q->rear + 1) % MAX_SIZE;
    q->data[q->rear] = booking;
    printf("Flight booked for %s on %s at %s\n", booking.passenger_name, booking.flight_number, booking.timing);
}

FlightBooking dequeue(FlightQueue *q) {
    FlightBooking empty = {0, "", "", "", "", "", "", 0.0};
    if (isEmpty(q)) {
        printf("No flight bookings in queue!\n");
        return empty;
    }
    FlightBooking booking = q->data[q->front];
    if (q->front == q->rear) {
        q->front = q->rear = -1;
    } else {
        q->front = (q->front + 1) % MAX_SIZE;
    }
    return booking;
}

void saveToFile(FlightQueue *q) {
    FILE *file = fopen("flight_bookings.txt", "w");
    if (!file) {
        printf("Error opening file!\n");
        return;
    }
    
    int i = q->front;
    while (i != -1) {
        fprintf(file, "%d,%s,%s,%s,%s,%s,%s,%s,%.2f\n", 
                q->data[i].flight_id, q->data[i].passenger_name, 
                q->data[i].from_city, q->data[i].to_city,
                q->data[i].flight_number, q->data[i].timing,
                q->data[i].seat_class, q->data[i].booking_date, q->data[i].price);
        if (i == q->rear) break;
        i = (i + 1) % MAX_SIZE;
    }
    fclose(file);
    printf("Flight data saved to file\n");
}

void saveBookingToFile(FlightBooking booking) {
    FILE *file = fopen("flight_bookings.txt", "a");
    if (!file) {
        printf("Error opening file!\n");
        return;
    }
    
    fprintf(file, "%d,%s,%s,%s,%s,%s,%s,%s,%.2f\n", 
            booking.flight_id, booking.passenger_name, 
            booking.from_city, booking.to_city,
            booking.flight_number, booking.timing,
            booking.seat_class, booking.booking_date, booking.price);
    fclose(file);
}

void viewAllBookings() {
    FILE *file = fopen("flight_bookings.txt", "r");
    if (!file) {
        printf("No booking records found!\n");
        return;
    }
    
    printf("\n=== ALL FLIGHT BOOKINGS ===\n");
    printf("%-5s %-15s %-12s %-12s %-10s %-8s %-10s %-12s %-8s\n", 
           "ID", "Passenger", "From", "To", "Flight", "Time", "Class", "Date", "Price");
    printf("-------------------------------------------------------------------------------------\n");
    
    FlightBooking booking;
    int count = 0;
    while (fscanf(file, "%d,%49[^,],%49[^,],%49[^,],%19[^,],%9[^,],%19[^,],%14[^,],%f\n", 
                  &booking.flight_id, booking.passenger_name, 
                  booking.from_city, booking.to_city,
                  booking.flight_number, booking.timing,
                  booking.seat_class, booking.booking_date, &booking.price) == 9) {
        printf("%-5d %-15s %-12s %-12s %-10s %-8s %-10s %-12s $%-7.2f\n", 
               booking.flight_id, booking.passenger_name,
               booking.from_city, booking.to_city,
               booking.flight_number, booking.timing,
               booking.seat_class, booking.booking_date, booking.price);
        count++;
    }
    
    fclose(file);
    printf("\nTotal bookings: %d\n", count);
}

void loadFromFile(FlightQueue *q) {
    FILE *file = fopen("flight_bookings.txt", "r");
    if (!file) {
        printf("No existing booking file found\n");
        return;
    }
    
    FlightBooking booking;
    int loaded = 0;
    while (fscanf(file, "%d,%49[^,],%49[^,],%49[^,],%19[^,],%9[^,],%19[^,],%14[^,],%f\n", 
                  &booking.flight_id, booking.passenger_name, 
                  booking.from_city, booking.to_city,
                  booking.flight_number, booking.timing,
                  booking.seat_class, booking.booking_date, &booking.price) == 9) {
        enqueue(q, booking);
        loaded++;
    }
    fclose(file);
    if (loaded > 0) {
        printf("Loaded %d bookings from file\n", loaded);
    }
}

void displayQueue(FlightQueue *q) {
    if (isEmpty(q)) {
        printf("No flight bookings in queue\n");
        return;
    }
    
    printf("\nFlight Bookings in Queue:\n");
    printf("%-5s %-15s %-12s %-12s %-10s %-8s %-10s %-12s %-8s\n", 
           "ID", "Passenger", "From", "To", "Flight", "Time", "Class", "Date", "Price");
    printf("-------------------------------------------------------------------------------------\n");
    
    int i = q->front;
    while (i != -1) {
        printf("%-5d %-15s %-12s %-12s %-10s %-8s %-10s %-12s $%-7.2f\n", 
               q->data[i].flight_id, q->data[i].passenger_name,
               q->data[i].from_city, q->data[i].to_city,
               q->data[i].flight_number, q->data[i].timing,
               q->data[i].seat_class, q->data[i].booking_date, q->data[i].price);
        if (i == q->rear) break;
        i = (i + 1) % MAX_SIZE;
    }
}

int main() {
    FlightQueue q;
    initQueue(&q);
    loadFlightDatabase();
    loadFromFile(&q);
    
    int choice, id = 1;
    FlightBooking booking;
    
    printf("\n=== ✈️  SKYWINGS AIRLINES BOOKING SYSTEM ✈️  ===\n");
    printf("           Soar High, Dream Higher!\n");
    printf("         Your Wings to the World.\n");
    
    while (1) {
        printf("\n1. View Available Flights\n2. Book Flight\n3. Process Booking\n4. Display Queue\n5. View All Bookings\n6. Save & Exit\n");
        printf("Choice: ");
        scanf("%d", &choice);
        
        switch (choice) {
            case 1:
                displayAvailableFlights();
                break;
                
            case 2:
                booking.flight_id = id++;
                printf("Passenger Name: ");
                scanf("%s", booking.passenger_name);
                printf("Booking Date (YYYY-MM-DD): ");
                scanf("%s", booking.booking_date);
                printf("From City: ");
                scanf("%s", booking.from_city);
                printf("To City: ");
                scanf("%s", booking.to_city);
                printf("Flight Number: ");
                scanf("%s", booking.flight_number);
                printf("Class (Economy/Business/First): ");
                scanf("%s", booking.seat_class);
                
                booking.price = calculatePrice(booking.flight_number, booking.from_city, booking.to_city, booking.seat_class);
                
                if (booking.price > 0) {
                    // Find and set timing
                    for (int i = 0; i < total_flights; i++) {
                        if (strcmp(flights_db[i].flight_number, booking.flight_number) == 0) {
                            strcpy(booking.timing, flights_db[i].timing);
                            break;
                        }
                    }
                    printf("Price calculated: $%.2f\n", booking.price);
                    enqueue(&q, booking);
                    saveBookingToFile(booking);
                } else {
                    printf("Invalid flight details! Please check and try again.\n");
                }
                break;
                
            case 3:
                booking = dequeue(&q);
                if (booking.flight_id != 0) {
                    printf("Processing: %s (ID: %d) - %s to %s on %s at %s (Date: %s)\n", 
                           booking.passenger_name, booking.flight_id, 
                           booking.from_city, booking.to_city, booking.flight_number, booking.timing, booking.booking_date);
                }
                break;
                
            case 4:
                displayQueue(&q);
                break;
                
            case 5:
                viewAllBookings();
                break;
                
            case 6:
                saveToFile(&q);
                printf("Thank you for choosing SkyWings Airlines!\n");
                printf("Have a safe flight! ✈️\n");
                exit(0);
                
            default:
                printf("Invalid choice\n");
        }
    }
    
    return 0;
}