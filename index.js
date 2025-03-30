const firebaseConfig = {
  apiKey: "AIzaSyCBgf-yoYhefRfVreu1zw9ac_7AfP3_ysk",
  authDomain: "mcdoapp-17dc7.firebaseapp.com",
  databaseURL: "https://mcdoapp-17dc7-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "mcdoapp-17dc7",
  storageBucket: "mcdoapp-17dc7.appspot.com",
  messagingSenderId: "280810445582",
  appId: "1:280810445582:web:7776e5091c78838df4155f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let workStartTime = null;
let notificationSent = false;
let lastBreakTime = null;

function logAction(action) {
  const name = document.getElementById("workerName").value.trim();
  if (!name) {
    alert("عافاك كتب السمية ديالك!");
    return;
  }

  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString();

  const entry = {
    name,
    action,
    time,
    date
  };

  db.ref("workers").push(entry);
  updateTodayTable(date, time, action);

  if (action === "دخول الخدمة") {
    workStartTime = new Date();
    notificationSent = false;
    startWorkTimer(name);
  } else if (action === "بداية الراحة" || action === "رجوع من الراحة") {
    lastBreakTime = new Date();
    workStartTime = null;
    notificationSent = false;
  }
}

function startWork() { logAction("دخول الخدمة"); }
function startBreak() { logAction("بداية الراحة"); }
function endBreak() { logAction("رجوع من الراحة"); }

function updateTodayTable(date, time, action) {
  const table = document.getElementById("todayActivity");
  const row = document.createElement("tr");
  row.innerHTML = `<td>${date}</td><td>${time}</td><td>${action}</td>`;
  table.appendChild(row);
}

function startWorkTimer(name) {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  const interval = setInterval(() => {
    if (!workStartTime || notificationSent) return;

    const now = new Date();
    const diff = now - workStartTime;
    const minutes = Math.floor(diff / 60000);

    if (minutes >= 265) { // 4h25min
      showNotification(`الخدام ${name} خدم 4h25min! خاصو يرتاح.`);
      notificationSent = true;
      clearInterval(interval);
    }
  }, 60000); // check every minute
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification("🚨 تنبيه", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/888/888879.png" // أيقونة التنبيه
    });
  }
}

function checkBreakDuration() {
  if (lastBreakTime) {
    const now = new Date();
    const diff = now - lastBreakTime;
    const minutes = Math.floor(diff / 60000); // Get minutes passed

    if (minutes >= 35 && !notificationSent) {
      showBreakNotification();
    }
  }
}

function showBreakNotification() {
  if (Notification.permission === "granted") {
    new Notification("⏰ تنبيه", {
      body: `دخلت بعد 35 دقيقة راحة! خاصك تبدأ الخدمة من جديد.`,
      icon: "https://cdn-icons-png.flaticon.com/512/888/888879.png"
    });
    notificationSent = true;
  }
}

// Call this function periodically to check break time every minute
setInterval(checkBreakDuration, 60000);
