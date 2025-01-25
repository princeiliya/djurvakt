document.addEventListener('DOMContentLoaded', function() {
    const calendarWidget = document.getElementById('calendar-widget');
    const timeSlotsContainer = document.getElementById('time-slots');
    let currentDate = new Date();
    let selectedDate = null;

    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Get first and last day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Create calendar header
        let calendarHTML = `
            <div class="calendar-header">
                <button onclick="previousMonth()">&larr; Previous</button>
                <h3>${MONTHS[month]} ${year}</h3>
                <button onclick="nextMonth()">Next &rarr;</button>
            </div>
            <div class="calendar-grid">
                <div class="weekday">Sun</div>
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>
        `;

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < new Date(today.setHours(0, 0, 0, 0));
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            const classes = [
                'calendar-day',
                isToday ? 'today' : '',
                isPast ? 'past' : '',
                isSelected ? 'selected' : ''
            ].filter(Boolean).join(' ');
            
            calendarHTML += `
                <div class="${classes}"
                     onclick="${!isPast ? `selectDate(${year}, ${month}, ${day})` : ''}"
                     data-date="${date.toISOString()}">${day}</div>
            `;
        }

        calendarHTML += '</div>';
        calendarWidget.innerHTML = calendarHTML;
    }

    function selectDate(year, month, day) {
        selectedDate = new Date(year, month, day);
        renderCalendar();
        showTimeSlots(selectedDate.toISOString());
    }

    function showTimeSlots(dateString) {
        const date = new Date(dateString);
        const timeSlots = generateTimeSlots();
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        let timeSlotsHTML = `
            <div class="booking-time-container">
                <h4>Select Time for ${dateStr}</h4>
                <div class="time-selector">
                    <select id="time-select">
                        <option value="">Select a time</option>
                        ${timeSlots.map(slot => 
                            `<option value="${slot}">${slot}</option>`
                        ).join('')}
                    </select>
                </div>
                <button class="book-button" 
                        onclick="bookTimeSlot()" 
                        id="book-button" 
                        disabled>
                    Book Appointment
                </button>
            </div>
        `;
        
        timeSlotsContainer.innerHTML = timeSlotsHTML;

        // Add event listener to enable/disable book button based on selection
        document.getElementById('time-select').addEventListener('change', function(e) {
            document.getElementById('book-button').disabled = !e.target.value;
        });
    }

    function generateTimeSlots() {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            const hourStr = hour.toString().padStart(2, '0');
            slots.push(`${hourStr}:00`);
            slots.push(`${hourStr}:30`);
        }
        return slots;
    }

    // Initialize calendar
    renderCalendar();

    // Make functions available globally
    window.previousMonth = function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    };

    window.nextMonth = function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    };

    window.selectDate = selectDate;

    window.bookTimeSlot = function() {
        const timeSelect = document.getElementById('time-select');
        const selectedTime = timeSelect.value;
        const serviceType = document.getElementById('service-type').value;
        
        if (!selectedTime || !selectedDate) return;
        
        // Here you would typically send this data to a server
        const bookingData = {
            service: serviceType,
            date: selectedDate,
            time: selectedTime
        };
        
        console.log('Booking:', bookingData);
        
        // Visual feedback
        const bookButton = document.getElementById('book-button');
        bookButton.innerHTML = 'Booked!';
        bookButton.disabled = true;
        timeSelect.disabled = true;
        
        // Optional: Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <p>Successfully booked for ${selectedTime} on 
            ${selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
        `;
        document.querySelector('.booking-time-container').appendChild(successMessage);
    };

    document.getElementById('contact-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = document.getElementById('submit-button');
        const formStatus = document.getElementById('form-status');
        const form = this;
        
        // Disable the submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        formStatus.innerHTML = '';
        
        try {
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                message: document.getElementById('contact-message').value
            };

            await sendEmail(formData);
            
            // Show success message
            formStatus.innerHTML = '<div class="success-message">Message sent successfully!</div>';
            form.reset();
        } catch (error) {
            // Show error message
            formStatus.innerHTML = '<div class="error-message">Failed to send message. Please try again.</div>';
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
}); 