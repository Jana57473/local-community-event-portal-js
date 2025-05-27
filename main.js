// 1. JavaScript Basics & Setup
console.log("Welcome to the Community Portal");
window.addEventListener('load', () => {
  alert("Page is fully loaded!");
});

// 2. Syntax, Data Types, and Operators
const eventName = "Music Night";
const eventDate = "2025-06-10";
let availableSeats = 30;
let eventInfo = `${eventName} on ${eventDate}. Seats left: ${availableSeats}`;
console.log(eventInfo);
function decrementSeats() {
  if (availableSeats > 0) availableSeats--;
}

// 3. Conditionals, Loops, and Error Handling
const events = [
  { id: 1, name: "Music Night", date: "2025-06-10", category: "music", location: "Hall A", seats: 30 },
  { id: 2, name: "Baking Workshop", date: "2025-05-20", category: "workshop", location: "Kitchen", seats: 0 }, // full
  { id: 3, name: "Football Match", date: "2025-07-01", category: "sports", location: "Field", seats: 15 },
  { id: 4, name: "Jazz Concert", date: "2024-05-01", category: "music", location: "Hall B", seats: 25 }, // past
];

function isUpcoming(event) {
  return new Date(event.date) >= new Date() && event.seats > 0;
}

// 4. Functions, Scope, Closures, Higher-Order Functions
function addEvent(event) {
  events.push(event);
}
function registerUser(eventId) {
  try {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found");
    if (event.seats <= 0) throw new Error("No seats available");
    event.seats--;
    updateEventsUI();
    return true;
  } catch (err) {
    alert(err.message);
    return false;
  }
}
function filterEventsByCategory(category, callback) {
  let filtered = (category === "all") ? events : events.filter(e => e.category === category);
  callback(filtered.filter(isUpcoming));
}
// Closure to track total registrations per category
function registrationTracker() {
  let totals = {};
  return function(category) {
    totals[category] = (totals[category] || 0) + 1;
    return totals[category];
  };
}
const trackRegistration = registrationTracker();

// 5. Objects and Prototypes
function Event(name, date, category, location, seats) {
  this.name = name;
  this.date = date;
  this.category = category;
  this.location = location;
  this.seats = seats;
}
Event.prototype.checkAvailability = function() {
  return this.seats > 0;
};
const bakingEvent = new Event("Bread Baking", "2025-06-20", "workshop", "Kitchen", 10);
console.log(Object.entries(bakingEvent));

// 6. Arrays and Methods
addEvent({ id: 5, name: "Rock Concert", date: "2025-08-15", category: "music", location: "Stadium", seats: 50 });
const musicEvents = events.filter(e => e.category === "music");
const eventCards = events.map(e => `${e.category.toUpperCase()}: ${e.name}`);

// 7. DOM Manipulation
function updateEventsUI(filteredList) {
  const container = document.getElementById("eventsContainer");
  container.innerHTML = "";
  const toShow = filteredList || events.filter(isUpcoming);
  toShow.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${event.name}</h3>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Category:</strong> ${event.category}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Seats:</strong> <span id="seats-${event.id}">${event.seats}</span></p>
      <button onclick="handleRegister(${event.id})" ${event.seats === 0 ? "disabled" : ""}>Register</button>
    `;
    container.appendChild(card);
  });
  // Update registration form event options
  const eventSelect = document.querySelector('form select[name="event"]');
  eventSelect.innerHTML = '<option value="">Select Event</option>';
  toShow.forEach(event => {
    if (event.seats > 0) {
      eventSelect.innerHTML += `<option value="${event.id}">${event.name}</option>`;
    }
  });
}

// 8. Event Handling
window.handleRegister = function(eventId) {
  if (registerUser(eventId)) {
    alert("Registration successful!");
    // Track registration by category
    const event = events.find(e => e.id === eventId);
    if (event) {
      const total = trackRegistration(event.category);
      console.log(`Total registrations for ${event.category}: ${total}`);
    }
  }
};

// Filter by category
document.getElementById("categoryFilter").onchange = function() {
  filterEventsByCategory(this.value, updateEventsUI);
};
// Quick search by name
document.getElementById("searchInput").addEventListener("keydown", function(e) {
  const val = this.value + (e.key.length === 1 ? e.key : "");
  const filtered = events.filter(event =>
    isUpcoming(event) && event.name.toLowerCase().includes(val.toLowerCase())
  );
  updateEventsUI(filtered);
});

// 9. Async JS, Promises, Async/Await
function fetchEventsMock() {
  return new Promise(resolve => {
    setTimeout(() => resolve(events), 1000);
  });
}
function showSpinner(show) {
  document.getElementById("formSpinner").classList.toggle("hidden", !show);
}
function fetchAndDisplayEvents() {
  showSpinner(true);
  fetchEventsMock()
    .then(data => {
      updateEventsUI(data.filter(isUpcoming));
    })
    .catch(() => alert("Failed to load events"))
    .finally(() => showSpinner(false));
}
async function fetchAndDisplayEventsAsync() {
  showSpinner(true);
  try {
    const data = await fetchEventsMock();
    updateEventsUI(data.filter(isUpcoming));
  } catch {
    alert("Failed to load events");
  } finally {
    showSpinner(false);
  }
}

// 10. Modern JavaScript Features
function modernFunction(event = { name: "Default", date: "N/A" }) {
  let { name, date } = event;
  let copy = { ...event };
  console.log(`Modern: ${name} on ${date}`, copy);
}

// 11. Working with Forms
document.getElementById("registrationForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = this.elements["name"].value.trim();
  const email = this.elements["email"].value.trim();
  const eventId = parseInt(this.elements["event"].value, 10);
  const msg = document.getElementById("formMessage");
  msg.textContent = "";
  if (!name || !email || !eventId) {
    msg.textContent = "Please fill all fields.";
    msg.className = "error";
    return;
  }
  // 12. AJAX & Fetch API (simulate backend)
  showSpinner(true);
  setTimeout(() => {
    // Simulate POST
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({ name, email, eventId }),
      headers: { "Content-type": "application/json" }
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        msg.textContent = "Registration submitted!";
        msg.className = "success";
        registerUser(eventId);
      })
      .catch(() => {
        msg.textContent = "Registration failed.";
        msg.className = "error";
      })
      .finally(() => showSpinner(false));
  }, 1200);
});

// 13. Debugging and Testing
// Use console.log at key points above, and inspect in DevTools

// 14. jQuery and JS Frameworks
$('#registerBtn').click(function() {
  $('#formMessage').fadeIn().delay(1000).fadeOut();
});
// Example of .fadeIn() and .fadeOut() for event cards
// $('.event-card').fadeIn().delay(500).fadeOut(); // Uncomment to test

// Benefit of frameworks: React or Vue makes building complex UIs with state, components, and data binding much easier and more maintainable than vanilla JS or jQuery.

// Initial load
fetchAndDisplayEventsAsync();
