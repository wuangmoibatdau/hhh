document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    function switchTab(activeTab, inactiveTab, showForm, hideForm) {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');
        showForm.classList.add('active');
        hideForm.classList.remove('active');
    }

    loginTab.addEventListener('click', () => {
        switchTab(loginTab, registerTab, loginForm, registerForm);
    });

    registerTab.addEventListener('click', () => {
        switchTab(registerTab, loginTab, registerForm, loginForm);
    });

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type');
            passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
}));