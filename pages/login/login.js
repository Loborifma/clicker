document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await chrome.storage.local.set({ isAuthenticated: true });
  window.location.href = "../popup/popup.html";

  // const login = document.getElementById("login").value;
  // const password = document.getElementById("password").value;
  // const error = document.getElementById("error");

  // try {
  //     const response = await fetch("https://example.com/auth", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ login, password }),
  //     });

  //     if (response.ok) {
  //         const data = await response.json();
  //         if (data.success) {
  // await chrome.storage.local.set({ isAuthenticated: true });
  // window.location.href = "../popup/popup.html";
  //         } else {
  //             error.hidden = false;
  //             error.textContent = "Неверный логин или пароль";
  //         }
  //     } else {
  //         throw new Error("Ошибка сервера");
  //     }
  // } catch (err) {
  //     error.hidden = false;
  //     error.textContent = "Ошибка соединения: " + err.message;
  // }
});
