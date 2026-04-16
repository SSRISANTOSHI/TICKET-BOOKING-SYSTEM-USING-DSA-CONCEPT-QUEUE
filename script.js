class FlightBookingSystem {
    constructor() {
        this.queue = [];
        this.nextId = 1;
        this.totalRevenue = 0;
        this.segments = 1;
        this.usdToInr = 83;
        this.flightsDB = [
            // Delhi flights
            {flight: 'SW101', from: 'Delhi', to: 'Mumbai', time: '06:00', price: 150},
            {flight: 'SW102', from: 'Delhi', to: 'Bangalore', time: '08:15', price: 200},
            {flight: 'SW103', from: 'Delhi', to: 'Chennai', time: '11:30', price: 220},
            {flight: 'SW104', from: 'Delhi', to: 'Kolkata', time: '07:00', price: 170},
            {flight: 'SW105', from: 'Delhi', to: 'Hyderabad', time: '09:45', price: 190},
            {flight: 'SW106', from: 'Delhi', to: 'Goa', time: '12:15', price: 250},
            // Mumbai flights
            {flight: 'SW201', from: 'Mumbai', to: 'Delhi', time: '14:30', price: 150},
            {flight: 'SW202', from: 'Mumbai', to: 'Bangalore', time: '10:45', price: 180},
            {flight: 'SW203', from: 'Mumbai', to: 'Chennai', time: '16:20', price: 180},
            {flight: 'SW204', from: 'Mumbai', to: 'Kolkata', time: '13:15', price: 200},
            {flight: 'SW205', from: 'Mumbai', to: 'Hyderabad', time: '11:30', price: 160},
            {flight: 'SW206', from: 'Mumbai', to: 'Goa', time: '09:45', price: 120},
            // Bangalore flights
            {flight: 'SW301', from: 'Bangalore', to: 'Delhi', time: '16:45', price: 200},
            {flight: 'SW302', from: 'Bangalore', to: 'Mumbai', time: '18:30', price: 180},
            {flight: 'SW303', from: 'Bangalore', to: 'Chennai', time: '07:15', price: 140},
            {flight: 'SW304', from: 'Bangalore', to: 'Kolkata', time: '14:20', price: 220},
            {flight: 'SW305', from: 'Bangalore', to: 'Hyderabad', time: '13:15', price: 140},
            {flight: 'SW306', from: 'Bangalore', to: 'Goa', time: '15:45', price: 160},
            // Chennai flights
            {flight: 'SW401', from: 'Chennai', to: 'Delhi', time: '19:45', price: 220},
            {flight: 'SW402', from: 'Chennai', to: 'Mumbai', time: '18:20', price: 180},
            {flight: 'SW403', from: 'Chennai', to: 'Bangalore', time: '20:15', price: 140},
            {flight: 'SW404', from: 'Chennai', to: 'Kolkata', time: '12:30', price: 240},
            {flight: 'SW405', from: 'Chennai', to: 'Hyderabad', time: '08:45', price: 150},
            {flight: 'SW406', from: 'Chennai', to: 'Goa', time: '17:30', price: 200},
            // Kolkata flights
            {flight: 'SW501', from: 'Kolkata', to: 'Delhi', time: '15:30', price: 170},
            {flight: 'SW502', from: 'Kolkata', to: 'Mumbai', time: '21:15', price: 200},
            {flight: 'SW503', from: 'Kolkata', to: 'Bangalore', time: '06:45', price: 220},
            {flight: 'SW504', from: 'Kolkata', to: 'Chennai', time: '14:20', price: 240},
            {flight: 'SW505', from: 'Kolkata', to: 'Hyderabad', time: '10:30', price: 210},
            {flight: 'SW506', from: 'Kolkata', to: 'Goa', time: '19:15', price: 280},
            // Hyderabad flights
            {flight: 'SW601', from: 'Hyderabad', to: 'Delhi', time: '22:15', price: 190},
            {flight: 'SW602', from: 'Hyderabad', to: 'Mumbai', time: '05:30', price: 160},
            {flight: 'SW603', from: 'Hyderabad', to: 'Bangalore', time: '21:30', price: 140},
            {flight: 'SW604', from: 'Hyderabad', to: 'Chennai', time: '16:45', price: 150},
            {flight: 'SW605', from: 'Hyderabad', to: 'Kolkata', time: '12:15', price: 210},
            {flight: 'SW606', from: 'Hyderabad', to: 'Goa', time: '14:30', price: 180},
            // Goa flights
            {flight: 'SW701', from: 'Goa', to: 'Delhi', time: '08:45', price: 250},
            {flight: 'SW702', from: 'Goa', to: 'Mumbai', time: '17:15', price: 120},
            {flight: 'SW703', from: 'Goa', to: 'Bangalore', time: '11:20', price: 160},
            {flight: 'SW704', from: 'Goa', to: 'Chennai', time: '13:45', price: 200},
            {flight: 'SW705', from: 'Goa', to: 'Kolkata', time: '07:30', price: 280},
            {flight: 'SW706', from: 'Goa', to: 'Hyderabad', time: '19:45', price: 180}
        ];
        this.loadFromStorage();
        this.initEventListeners();
        this.setDefaultDate();
        this.updateDisplay();
    }

    initEventListeners() {
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.bookFlight();
        });

        document.getElementById('processBtn').addEventListener('click', () => {
            this.processBooking();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.updateDisplay();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.saveToFile();
        });

        document.getElementById('viewAllBtn').addEventListener('click', () => {
            this.viewAllStoredBookings();
        });



        // Remove old event listeners as they're handled in setupSegmentListeners

        document.getElementById('seatClass').addEventListener('change', () => {
            this.calculatePrice();
        });

        document.getElementById('tripType').addEventListener('change', () => {
            this.handleTripTypeChange();
        });

        document.getElementById('addSegmentBtn').addEventListener('click', () => {
            this.addFlightSegment();
        });

        document.querySelectorAll('input[name="currency"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.calculatePrice();
            });
        });

        this.initTheme();
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').value = today;
        document.getElementById('bookingDate').min = today;
    }

    calculateSegmentPrice(segment, seatClass) {
        const fromCity = segment.querySelector('.fromCity').value;
        const toCity = segment.querySelector('.toCity').value;
        const flightNumber = segment.querySelector('.flightNumber').value;
        
        const flight = this.flightsDB.find(f => 
            f.flight === flightNumber && f.from === fromCity && f.to === toCity
        );
        
        if (!flight) return 0;
        
        let price = flight.price;
        if (seatClass === 'Business') price *= 2.5;
        else if (seatClass === 'First') price *= 4.0;
        
        return price;
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // Add transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('.theme-icon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    handleTripTypeChange() {
        const tripType = document.getElementById('tripType').value;
        const addBtn = document.getElementById('addSegmentBtn');
        const segments = document.getElementById('tripSegments');
        
        if (!tripType) {
            segments.innerHTML = '';
            addBtn.style.display = 'none';
            document.getElementById('calculatedPrice').textContent = 'Select trip type';
            return;
        }
        
        // Reset segments
        this.segments = 1;
        segments.innerHTML = this.createSegmentHTML(1, 'Outbound Flight');
        
        if (tripType === 'roundtrip') {
            // Add return flight automatically
            this.segments = 2;
            segments.innerHTML += this.createSegmentHTML(2, 'Return Flight');
            addBtn.style.display = 'none';
        } else {
            addBtn.style.display = 'none';
        }
        
        // Setup listeners after DOM update
        setTimeout(() => {
            this.setupSegmentListeners();
            if (tripType === 'roundtrip') {
                this.setupRoundTripLinking();
            }
            this.calculatePrice();
        }, 50);
    }

    setupRoundTripLinking() {
        const segments = document.getElementById('tripSegments');
        const outboundFrom = segments.querySelector('[data-segment="1"] .fromCity');
        const outboundTo = segments.querySelector('[data-segment="1"] .toCity');
        const returnFrom = segments.querySelector('[data-segment="2"] .fromCity');
        const returnTo = segments.querySelector('[data-segment="2"] .toCity');
        
        if (outboundFrom && outboundTo && returnFrom && returnTo) {
            outboundFrom.addEventListener('change', () => {
                returnTo.value = outboundFrom.value;
                this.updateFlightOptions(segments.querySelector('[data-segment="2"]'));
            });
            
            outboundTo.addEventListener('change', () => {
                returnFrom.value = outboundTo.value;
                this.updateFlightOptions(segments.querySelector('[data-segment="2"]'));
            });
        }
    }

    createSegmentHTML(segmentNum, title = null) {
        const segmentTitle = title || `Flight ${segmentNum}`;
        
        return `
            <div class="trip-segment" data-segment="${segmentNum}">
                <div class="segment-header">
                    <h4>${segmentTitle}</h4>
                </div>
                <div class="segment-fields">
                    <select class="fromCity" required>
                        <option value="">From City</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Goa">Goa</option>
                    </select>
                    <select class="toCity" required>
                        <option value="">To City</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Goa">Goa</option>
                    </select>
                    <select class="flightNumber" required>
                        <option value="">Select Flight</option>
                    </select>
                    <div class="segment-price" id="segmentPrice${segmentNum}">-</div>
                </div>
            </div>
        `;
    }



    setupSegmentListeners() {
        // Add listeners to all segments
        document.querySelectorAll('.trip-segment').forEach(segment => {
            const fromCity = segment.querySelector('.fromCity');
            const toCity = segment.querySelector('.toCity');
            const flightNumber = segment.querySelector('.flightNumber');
            
            if (fromCity && toCity && flightNumber) {
                // Add new listeners
                fromCity.addEventListener('change', (e) => {
                    this.updateFlightOptions(e.target.closest('.trip-segment'));
                });
                
                toCity.addEventListener('change', (e) => {
                    this.updateFlightOptions(e.target.closest('.trip-segment'));
                });
                
                flightNumber.addEventListener('change', () => {
                    this.calculatePrice();
                });
            }
        });
    }

    updateFlightOptions(segment) {
        if (!segment) {
            console.log('No segment provided');
            return;
        }
        
        const fromCity = segment.querySelector('.fromCity')?.value;
        const toCity = segment.querySelector('.toCity')?.value;
        const flightSelect = segment.querySelector('.flightNumber');
        
        if (!flightSelect) {
            console.log('No flight select found');
            return;
        }
        
        console.log(`Updating flights for ${fromCity} to ${toCity}`);
        
        // Clear existing options
        flightSelect.innerHTML = '<option value="">Select Flight</option>';
        
        if (fromCity && toCity && fromCity !== toCity) {
            const availableFlights = this.flightsDB.filter(f => 
                f.from === fromCity && f.to === toCity
            );
            
            console.log(`Found ${availableFlights.length} flights`);
            
            if (availableFlights.length > 0) {
                availableFlights.forEach(flight => {
                    const option = document.createElement('option');
                    option.value = flight.flight;
                    option.textContent = `${flight.flight} - ${flight.time}`;
                    flightSelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No flights available';
                option.disabled = true;
                flightSelect.appendChild(option);
            }
        }
        
        this.calculatePrice();
    }

    calculatePrice() {
        const seatClass = document.getElementById('seatClass').value;
        const currency = document.querySelector('input[name="currency"]:checked')?.value || 'USD';
        const priceDisplay = document.getElementById('calculatedPrice');
        const segments = document.querySelectorAll('.trip-segment');
        const tripType = document.getElementById('tripType').value;
        
        let totalPrice = 0;
        let validSegments = 0;
        let priceBreakdown = [];
        
        segments.forEach((segment, index) => {
            const fromCity = segment.querySelector('.fromCity').value;
            const toCity = segment.querySelector('.toCity').value;
            const flightNumber = segment.querySelector('.flightNumber').value;
            const segmentPriceEl = segment.querySelector(`#segmentPrice${index + 1}`);
            
            if (fromCity && toCity && flightNumber && seatClass) {
                const flight = this.flightsDB.find(f => 
                    f.flight === flightNumber && f.from === fromCity && f.to === toCity
                );
                
                if (flight) {
                    let price = flight.price;
                    if (seatClass === 'Business') price *= 2.5;
                    else if (seatClass === 'First') price *= 4.0;
                    
                    // Round-trip discount
                    if (tripType === 'roundtrip' && index === 1) {
                        price *= 0.9; // 10% discount on return
                    }
                    
                    totalPrice += price;
                    validSegments++;
                    
                    const displayPrice = currency === 'INR' ? 
                        `₹${(price * this.usdToInr).toFixed(0)}` : 
                        `$${price.toFixed(2)}`;
                    
                    segmentPriceEl.textContent = displayPrice;
                    segmentPriceEl.className = 'segment-price active';
                    priceBreakdown.push(displayPrice);
                } else {
                    segmentPriceEl.textContent = '-';
                    segmentPriceEl.className = 'segment-price';
                }
            } else {
                segmentPriceEl.textContent = '-';
                segmentPriceEl.className = 'segment-price';
            }
        });
        
        if (validSegments === segments.length && seatClass && segments.length > 0) {
            const finalPrice = currency === 'INR' ? 
                `₹${(totalPrice * this.usdToInr).toFixed(0)}` : 
                `$${totalPrice.toFixed(2)}`;
            
            let priceText = finalPrice;
            if (tripType === 'roundtrip' && validSegments === 2) {
                priceText += ' (10% return discount applied)';
            }
            
            priceDisplay.textContent = priceText;
            priceDisplay.className = 'price-display active';
        } else {
            priceDisplay.textContent = segments.length === 0 ? 'Select trip type' : 'Complete all flight details';
            priceDisplay.className = 'price-display';
        }
    }



    bookFlight() {
        const passengerName = document.getElementById('passengerName').value.trim();
        const bookingDate = document.getElementById('bookingDate').value;
        const tripType = document.getElementById('tripType').value;
        const seatClass = document.getElementById('seatClass').value;
        const segments = document.querySelectorAll('.trip-segment');
        
        if (!passengerName || !bookingDate || !tripType || !seatClass) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (segments.length === 0) {
            alert('Please select a trip type first');
            return;
        }
        
        let totalPrice = 0;
        let flightDetails = [];
        let timings = [];
        
        for (let [index, segment] of segments.entries()) {
            const fromCity = segment.querySelector('.fromCity').value;
            const toCity = segment.querySelector('.toCity').value;
            const flightNumber = segment.querySelector('.flightNumber').value;
            
            if (!fromCity || !toCity || !flightNumber) {
                alert(`Please complete flight ${index + 1} details`);
                return;
            }
            
            const flight = this.flightsDB.find(f => 
                f.flight === flightNumber && f.from === fromCity && f.to === toCity
            );
            
            if (!flight) {
                alert(`Invalid flight selection for segment ${index + 1}`);
                return;
            }
            
            let price = flight.price;
            if (seatClass === 'Business') price *= 2.5;
            else if (seatClass === 'First') price *= 4.0;
            
            // Apply round-trip discount
            if (tripType === 'roundtrip' && index === 1) {
                price *= 0.9;
            }
            
            totalPrice += price;
            flightDetails.push(`${fromCity}→${toCity} (${flightNumber})`);
            timings.push(flight.time);
        }
        
        // For round-trip, create separate bookings for outbound and return
        if (tripType === 'roundtrip') {
            // Create outbound booking
            const outboundSegment = segments[0];
            const outboundBooking = {
                flight_id: this.nextId++,
                passenger_name: passengerName,
                from_city: outboundSegment.querySelector('.fromCity').value,
                to_city: outboundSegment.querySelector('.toCity').value,
                flight_number: outboundSegment.querySelector('.flightNumber').value,
                timing: this.flightsDB.find(f => f.flight === outboundSegment.querySelector('.flightNumber').value).time,
                seat_class: seatClass,
                trip_type: 'Outbound',
                segments: 1,
                price: this.calculateSegmentPrice(outboundSegment, seatClass),
                timestamp: new Date().toLocaleTimeString(),
                booking_date: bookingDate
            };
            
            // Create return booking
            const returnSegment = segments[1];
            const returnBooking = {
                flight_id: this.nextId++,
                passenger_name: passengerName,
                from_city: returnSegment.querySelector('.fromCity').value,
                to_city: returnSegment.querySelector('.toCity').value,
                flight_number: returnSegment.querySelector('.flightNumber').value,
                timing: this.flightsDB.find(f => f.flight === returnSegment.querySelector('.flightNumber').value).time,
                seat_class: seatClass,
                trip_type: 'Return',
                segments: 1,
                price: this.calculateSegmentPrice(returnSegment, seatClass) * 0.9, // 10% discount
                timestamp: new Date().toLocaleTimeString(),
                booking_date: bookingDate
            };
            
                this.queue.push(outboundBooking);
            this.queue.push(returnBooking);
            
            // Also store in permanent storage
            this.addToAllBookings(outboundBooking);
            this.addToAllBookings(returnBooking);
        } else {
            // Single booking for one-way
            const booking = {
                flight_id: this.nextId++,
                passenger_name: passengerName,
                from_city: segments[0].querySelector('.fromCity').value,
                to_city: segments[0].querySelector('.toCity').value,
                flight_number: segments[0].querySelector('.flightNumber').value,
                timing: this.flightsDB.find(f => f.flight === segments[0].querySelector('.flightNumber').value).time,
                seat_class: seatClass,
                trip_type: 'One-way',
                segments: 1,
                price: totalPrice,
                timestamp: new Date().toLocaleTimeString(),
                booking_date: bookingDate
            };
            
            this.queue.push(booking);
            
            // Also store in permanent storage
            this.addToAllBookings(booking);
        }
        

        this.saveToStorage();
        this.saveToFile(); // Immediately save to file
        this.updateDisplay();
        
        // Reset form
        document.getElementById('bookingForm').reset();
        document.getElementById('tripSegments').innerHTML = '';
        document.getElementById('addSegmentBtn').style.display = 'none';
        document.getElementById('calculatedPrice').textContent = 'Select trip type';
        document.getElementById('calculatedPrice').className = 'price-display';
        this.setDefaultDate();
        
        // Success notification with trip details
        const tripDetails = tripType === 'roundtrip' ? 'round-trip' : 'one-way';
        const bookingCount = tripType === 'roundtrip' ? '2 bookings' : '1 booking';
        this.showNotification(`✅ ${tripDetails} ${bookingCount} saved to flight_bookings.txt for ${passengerName}!`, 'success');
        
        // Add booking animation
        document.getElementById('bookingForm').style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            document.getElementById('bookingForm').style.animation = '';
        }, 500);
    }

    processBooking() {
        if (this.queue.length === 0) {
            this.showNotification('No flight bookings in queue', 'error');
            return;
        }

        const booking = this.queue.shift();
        this.totalRevenue += booking.price;
        
        // Mark as processed in permanent storage
        this.markAsProcessed(booking.flight_id);
        
        this.saveToStorage();
        this.updateDisplay();
        
        this.showNotification(`Processing: ${booking.passenger_name} - ${booking.from_city} to ${booking.to_city}`, 'info');
    }

    updateDisplay() {
        const queueDisplay = document.getElementById('queueDisplay');
        const queueCount = document.getElementById('queueCount');
        const nextIdDisplay = document.getElementById('nextId');
        const totalRevenueDisplay = document.getElementById('totalRevenue');

        queueCount.textContent = this.queue.length;
        nextIdDisplay.textContent = this.nextId;
        totalRevenueDisplay.textContent = `$${this.totalRevenue.toFixed(2)} / ₹${(this.totalRevenue * this.usdToInr).toFixed(0)}`;

        if (this.queue.length === 0) {
            queueDisplay.innerHTML = '<p class="empty-queue">No flight bookings in queue</p>';
            return;
        }

        queueDisplay.innerHTML = this.queue.map((booking, index) => `
            <div class="flight-card ${index === 0 ? 'next' : ''}" style="animation-delay: ${index * 0.1}s">
                <div class="flight-info">
                    <h3>✈️ ${booking.passenger_name}</h3>
                    <p class="route">${booking.from_city} → ${booking.to_city}</p>
                    <p>Flight: ${booking.flight_number} at ${booking.timing || 'N/A'}</p>
                    <p>Type: ${booking.trip_type || 'One Way'}</p>
                    <p>Date: ${booking.booking_date} | Time: ${booking.timestamp}</p>
                </div>
                <div class="flight-details">
                    <div class="flight-id">#${booking.flight_id}</div>
                    <div class="flight-class">${booking.seat_class}</div>
                    <div class="flight-price">$${booking.price.toFixed(2)} / ₹${(booking.price * this.usdToInr).toFixed(0)}</div>
                </div>
            </div>
        `).join('');
        
        // Trigger animation for new cards
        setTimeout(() => {
            document.querySelectorAll('.flight-card').forEach(card => {
                card.style.animation = 'none';
            });
        }, 1000);
    }

    saveToStorage() {
        localStorage.setItem('flightQueue', JSON.stringify(this.queue));
        localStorage.setItem('nextFlightId', this.nextId.toString());
        localStorage.setItem('totalRevenue', this.totalRevenue.toString());
    }

    async saveToFile() {
        try {
            // Include all bookings (processed and pending)
            const allBookings = JSON.parse(localStorage.getItem('allFlightBookings') || '[]');
            const fileContent = allBookings.map(booking => 
                `${booking.flight_id},${booking.passenger_name},${booking.from_city},${booking.to_city},${booking.flight_number},${booking.timing || 'N/A'},${booking.seat_class},${booking.booking_date},${booking.price.toFixed(2)},${booking.status || 'Pending'}`
            ).join('\n');
            
            // Create downloadable file
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Auto-download updated file
            const a = document.createElement('a');
            a.href = url;
            a.download = 'flight_bookings.txt';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Booking data saved to flight_bookings.txt');
        } catch (error) {
            console.error('Error saving to file:', error);
        }
    }

    loadFromStorage() {
        const savedQueue = localStorage.getItem('flightQueue');
        const savedNextId = localStorage.getItem('nextFlightId');
        const savedRevenue = localStorage.getItem('totalRevenue');

        if (savedQueue) {
            this.queue = JSON.parse(savedQueue);
        }

        if (savedNextId) {
            this.nextId = parseInt(savedNextId);
        }

        if (savedRevenue) {
            this.totalRevenue = parseFloat(savedRevenue);
        }
        
        // Load all bookings and sync with queue
        const allBookings = JSON.parse(localStorage.getItem('allFlightBookings') || '[]');
        if (allBookings.length > 0 && this.queue.length === 0) {
            // Restore pending bookings to queue
            const pendingBookings = allBookings.filter(b => b.status === 'Pending');
            this.queue = pendingBookings;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#7c3aed'};
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    viewAllStoredBookings() {
        // Get all bookings from localStorage (includes processed ones)
        const allStoredBookings = JSON.parse(localStorage.getItem('allFlightBookings') || '[]');
        
        if (allStoredBookings.length === 0) {
            this.showNotification('No bookings stored yet. Book some flights first!', 'info');
            return;
        }
        
        const allBookings = allStoredBookings;
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--card-bg);
            padding: 30px;
            border-radius: 15px;
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
            color: var(--text-color);
        `;
        
        content.innerHTML = `
            <h2 style="margin-bottom: 20px; color: var(--primary-color);">📋 All Stored Bookings (${allBookings.length})</h2>
            <div style="margin-bottom: 20px;">
                ${allBookings.map(booking => {
                    const statusColor = booking.status === 'Processed' ? '#4CAF50' : '#ff9800';
                    const statusText = booking.status === 'Processed' ? 
                        `✅ Processed ${booking.processed_time ? 'on ' + booking.processed_time : ''}` : 
                        '⏳ Pending';
                    return `
                        <div style="border: 1px solid var(--border-color); padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid ${statusColor};">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong>ID: ${booking.flight_id}</strong> - ${booking.passenger_name}
                                <span style="color: ${statusColor}; font-weight: bold; font-size: 12px;">${statusText}</span>
                            </div>
                            <span style="color: var(--primary-color);">${booking.from_city} → ${booking.to_city}</span><br>
                            Flight: ${booking.flight_number} | Date: ${booking.booking_date}<br>
                            Class: ${booking.seat_class} | Price: $${booking.price.toFixed(2)}
                        </div>
                    `;
                }).join('')}
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    addToAllBookings(booking) {
        const allBookings = JSON.parse(localStorage.getItem('allFlightBookings') || '[]');
        allBookings.push({...booking, status: 'Pending'});
        localStorage.setItem('allFlightBookings', JSON.stringify(allBookings));
    }

    markAsProcessed(flightId) {
        const allBookings = JSON.parse(localStorage.getItem('allFlightBookings') || '[]');
        const booking = allBookings.find(b => b.flight_id === flightId);
        if (booking) {
            booking.status = 'Processed';
            booking.processed_time = new Date().toLocaleString();
        }
        localStorage.setItem('allFlightBookings', JSON.stringify(allBookings));
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the system when page loads
let flightSystem;
document.addEventListener('DOMContentLoaded', () => {
    flightSystem = new FlightBookingSystem();
});