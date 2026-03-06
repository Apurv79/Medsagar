window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const msg = document.getElementById('msg');
    const loader = document.getElementById('loader');

    if (!token) {
        showMsg('Error: Verification token missing', true);
        return;
    }

    try {
        const response = await fetch('/api/v1/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok) {
            showMsg('Verified! Your account is now active.', false);
        } else {
            showMsg('Error: ' + (data.message || 'Verification failed'), true);
        }
    } catch (err) {
        showMsg('Error: Connection to server failed', true);
    }
};

function showMsg(text, isError) {
    const msg = document.getElementById('msg');
    const loader = document.getElementById('loader');
    const sub = document.getElementById('sub-msg');

    if (loader) loader.style.display = 'none';
    if (sub) sub.style.display = 'none';
    msg.innerText = text;
    msg.style.display = 'block';
    msg.className = isError ? 'message error' : 'message success';
}
