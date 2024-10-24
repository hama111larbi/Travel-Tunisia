<?php
require 'config.php';
if(!empty($_SESSION["id"])){
    $id = $_SESSION["id"];
    $result = mysqli_query($conn, "SELECT * FROM tb_user WHERE id = $id");
    $row = mysqli_fetch_assoc($result);
}
else{
    header("Location: login.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div class="container">
        <h1>Welcome  <?php echo htmlspecialchars($row['username']); ?></h1>
        <h4>Where is your next destination?</h4>
        <p>You can choose here</p>
        <select id="countryList">
            <option value="">Select a country</option>
        </select>
        <a href="logout.php">Logout</a>
    </div>

    <script>
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                const countryList = document.getElementById('countryList');
                data.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.cca2; // Use country code as value
                    option.textContent = country.name.common;
                    countryList.appendChild(option);
                });

                countryList.addEventListener('change', (event) => {
                    const selectedCountryCode = event.target.value;
                    if (selectedCountryCode) {
                        window.location.href = `country.html?code=${selectedCountryCode}`;
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching country data:', error);
            });
    </script>
</body>
</html>
