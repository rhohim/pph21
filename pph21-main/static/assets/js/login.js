// Date
// var today = new Date();
// var day = today.getDate();
// var month = today.getMonth() + 1;

// function appendZero(value) {
//     return "0" + value;
// }

// function theTime() {
//     var d = new Date();
//     document.getElementById("time").innerHTML = d.toLocaleTimeString("en-US");
// }

// if (day < 10) {
//     day = appendZero(day);
// }

// if (month < 10) {
//     month = appendZero(month);
// }

// today = day + "/" + month + "/" + today.getFullYear();

// document.getElementById("date").innerHTML = today;

// var myVar = setInterval(function () {
//     theTime();
// }, 1000);


// var jwt = sessionStorage.getItem("jwt");
// if (jwt != null) {
//     window.location.href = './home'
// }

function login() {
    const identifier = document.getElementById("identifier").value;
    const password = document.getElementById("password").value;
    // document.getElementById('loader').style.display = "block"
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:1337/api/auth/local/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "identifier": identifier,
        "password": password
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            // console.log(objects.error.status);
            if (objects['jwt'] !== null) {
                // document.getElementById('loader').style.display = "none"
                sessionStorage.setItem("jwt", objects['jwt']);
                const getToken = sessionStorage.getItem("jwt")
                if(getToken === objects['jwt']){
                    Swal.fire({
                        text: "Click Ok to Continue",
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("success")
                            window.location.href = './index.html';
                        }
                    });
                }
            }
            if (objects['jwt'] === undefined) {
                // document.getElementById('loader').style.display = "none"
                sessionStorage.removeItem("jwt", objects['jwt']);
                Swal.fire({
                    text: "Email or password is incorrect",
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
                return
            }
            if (objects.error.status === 400) {
                Swal.fire({
                    text: objects.error.status,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
            // } else {
            //     Swal.fire({
            //         text: objects['message'],
            //         icon: 'error',
            //         confirmButtonText: 'OK'
            //     });
            // }
            console.log(objects)
        }
    };
    return false;
}
