document.addEventListener('DOMContentLoaded', () => {
  try {
    const firebaseConfig = {
      apiKey: "AIzaSyB5hYKIi9R_UuL9KI-Y17upyMHNbHgiA9Y",
      authDomain: "invest1001-a5282.firebaseapp.com",
      databaseURL: "https://invest1001-a5282-default-rtdb.firebaseio.com/",
      projectId: "invest1001-a5282",
      storageBucket: "invest1001-a5282.firebasestorage.app",
      messagingSenderId: "409129504874",
      appId: "1:409129504874:web:fce17614df12345d327a13",
      measurementId: "G-6DL0Z71VMZ"
    };

    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    function updateAuthDisplay(user) {
      const loginBtn = document.getElementById('google-login-btn');
      const userInfo = document.getElementById('user-info');
      const purchaseBtns = document.querySelectorAll('.purchase-btn');
      const loginPrompts = document.querySelectorAll('.login-prompt');

      if (!loginBtn || !userInfo) {
        console.error('Login button or user info element not found');
        return;
      }

      if (user) {
        loginBtn.style.display = 'none';
        userInfo.innerHTML = `<img src="${user.photoURL || '/images/placeholder_icon.png'}" alt="User Icon" class="user-icon">`;
        purchaseBtns.forEach(btn => {
          btn.removeAttribute('disabled');
          btn.style.backgroundColor = '#007bff';
          btn.style.color = 'white';
          btn.onclick = () => showPaymentOptions(btn, user.uid, user.email);
        });
        loginPrompts.forEach(prompt => prompt.style.display = 'none');
      } else {
        loginBtn.style.display = 'flex';
        userInfo.innerHTML = '';
        purchaseBtns.forEach(btn => {
          btn.setAttribute('disabled', 'true');
          btn.style.backgroundColor = '#ccc';
          btn.style.color = '#666';
          btn.onclick = null;
        });
        loginPrompts.forEach(prompt => prompt.style.display = 'block');
      }
    }

    function showPaymentOptions(btn, uid, email) {
      const course = btn.getAttribute('data-course');
      try {
        let paymentOptions = btn.nextElementSibling.nextElementSibling;
        if (!paymentOptions || !paymentOptions.classList.contains('payment-options')) {
          paymentOptions = document.createElement('div');
          paymentOptions.className = 'payment-options';
          paymentOptions.innerHTML = `
            <img src="https://github.com/PKpKDdEa/Invest1001/blob/main/Invest1001website/payme.png?raw=true" alt="PayMe" data-method="payme" data-course="${course}">
            <img src="https://github.com/PKpKDdEa/Invest1001/blob/main/Invest1001website/alipay.png?raw=true" alt="Alipay" data-method="alipay" data-course="${course}">
          `;
          if (!btn.nextElementSibling || !btn.nextElementSibling.nextElementSibling) {
            console.error('DOM structure mismatch: insufficient siblings after button');
            btn.parentNode.appendChild(paymentOptions);
          } else {
            btn.parentNode.insertBefore(paymentOptions, btn.nextElementSibling.nextElementSibling);
          }
          paymentOptions.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', () => handlePayment(img.getAttribute('data-method'), course, uid, email));
            img.onerror = () => console.error(`Failed to load image: ${img.src}`);
          });
        }
        paymentOptions.style.display = paymentOptions.style.display === 'block' ? 'none' : 'block';
      } catch (error) {
        console.error('Error in showPaymentOptions:', error.message);
      }
    }

    function handlePayment(method, course, uid, email) {
      const prices = {
        T1: 3800,
        T2: 3800,
        T3: 3800,
        T4: 2888
      };
      if (method === 'payme') {
        alert('The course is coming soon!');
        //const paymeLink = `https://payme.hsbc.com.hk/1/${encodeURIComponent('invest1001@gmail.com')}?amount=${prices[course]}¬e=${course}_Purchase_${encodeURIComponent(email)}`;
        //window.location.href = paymeLink;
      } else if (method === 'alipay') {
        alert('The course is coming soon!');
      }
    }

    function attachLoginListener() {
      const loginBtn = document.getElementById('google-login-btn');
      if (loginBtn) {
        loginBtn.addEventListener('click', () => {
          console.log('Login button clicked');
          auth.signInWithPopup(googleProvider)
            .then((result) => {
              const user = result.user;
              console.log('Login successful:', user.email);
              db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: user.displayName,
                discordID: null,
                courses: {
                  T1: false,
                  T2: false,
                  T3: false,
                  T4: false,
                  T4_expiryDate: null,
                  T5: false,
                  T6: false,
                  T7: false,
                  Extra1: false,
                  Extra2: false,
                  FreeCourse1: false,
                  FreeCourse2: false,
                },
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
              }, { merge: true })
              .then(() => {
                console.log('User document created/updated');
                updateAuthDisplay(user);
              })
              .catch((error) => {
                console.error('Firestore error:', error.message);
                alert('Failed to save user data: ' + error.message);
              });
            })
            .catch((error) => {
              console.error('Login error:', error.message);
              alert('Login failed: ' + error.message);
            });
        });
        console.log('Login button listener attached');
      } else {
        console.error('google-login-btn not found, retrying...');
        setTimeout(attachLoginListener, 1000); // Retry after 1s
      }
    }

    attachLoginListener();

    auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      updateAuthDisplay(user);
    });
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    alert('Failed to initialize Firebase: ' + error.message);
  }
});
