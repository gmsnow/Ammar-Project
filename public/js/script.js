
function submitInquiry() {
    var serviceCode = document.getElementById('service_code').value;
    var idNumber = document.getElementById('id_number').value;

    if (serviceCode && idNumber) {
        fetch('/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'service_code=' + encodeURIComponent(serviceCode) + '&id_number=' + encodeURIComponent(idNumber)
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('result').innerHTML = data;
        })
        .catch(error => {
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').innerText = 'خطأ في الاستعلام: ' + error;
        });
    } else {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = 'لاتوجد نتائج.';
    }
}
