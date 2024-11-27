document.addEventListener("DOMContentLoaded", () => {
    // Handle form submissions for registration
    document.getElementById("registerForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append("action", "register");
        
        fetch("process.php", {
            method: "POST",
            body: formData,
        })
        .then((res) => res.text())
        .then((data) => alert(data === "success" ? "Registration Successful" : "Error in Registration"));
    });

    // Handle form submissions for login
    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append("action", "login");

        fetch("process.php", {
            method: "POST",
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            if (data !== "invalid") {
                localStorage.setItem("user", JSON.stringify(data));
                alert("Login Successful");
            } else {
                alert("Invalid Credentials");
            }
        });
    });
});
