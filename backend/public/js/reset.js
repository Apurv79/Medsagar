const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

async function handleReset() {
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (!token) {
        showMsg('Error: No token found in URL', true);
        return;
    }

    if (password !== confirm) {
        showMsg('Error: Passwords do not match', true);
        return;
    }

    if (password.length < 6) {
        showMsg('Error: Password must be at least 6 characters', true);
        return;
    }

    try {
        const response = await fetch('/api/v1/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMsg('Success! Your password has been updated.', false);
            document.getElementById('form-container').style.display = 'none';
        } else {
            showMsg('Error: ' + (data.message || 'Something went wrong'), true);
        }
    } catch (err) {
        showMsg('Error: Failed to connect to server', true);
    }
}

function showMsg(text, isError) {
    const msg = document.getElementById('msg');
    msg.innerText = text;
    msg.style.display = 'block';
    msg.className = isError ? 'message error' : 'message success';
}

// Bind event listener to avoid inline 'onclick' which is blocked by CSP
document.getElementById('reset-btn').addEventListener('click', handleReset);
