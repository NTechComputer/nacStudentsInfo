// update script
{
    let now = new Date().getTime();
    if(localStorage.lastUpadate){
        if(now - Number(localStorage.lastUpadate) > 10000){
            localStorage.lastUpadate = now;
            console.log("updated");
            window.location.reload();
        }
    }
    else{
        localStorage.lastUpadate = now;
    }
}

{
    function openMenu(){
        document.querySelector(".nav").style.display = "inline";
        document.getElementById("menu").style.left = "0";
    }

    function closeMenu(){
        document.querySelector(".nav").style.display = "none";
        document.getElementById("menu").style.left = "-300px";
    }

    function closeErr(){
        error.style.display = "none";
    }

    function closeSucc(){
        document.querySelector(".success").style.display = "none";
    }

     addInfoEnable()

    function addInfoEnable(){
        document.getElementById("addContainer").style.display = "block";
        document.getElementById("seeContainer").style.display = "none";
        document.querySelector(".table").innerHTML = "";
        if(localStorage.nacStuInfo){
            let data = JSON.parse(localStorage.nacStuInfo);
            document.getElementById("className").value = data.class;
            for(let i = 0; i < data.info.length; i++){
                createInfoTable(data.info[i])
            }
            document.querySelector(".btnDiv").style.display = "flex";
        }
        closeMenu()
    }

    function seeInfoEnable(){
        document.getElementById("addContainer").style.display = "none";
        document.getElementById("seeContainer").style.display = "block";
        document.querySelector(".table").innerHTML = "";
        document.querySelector(".btnDiv").style.display = "none";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".success").style.display = "none";
        closeMenu();
        seeInfo(document.getElementById("className2").value);
    }

    function addInfo(){
        let data;
        if(localStorage.nacStuInfo){
            data = JSON.parse(localStorage.nacStuInfo);
        }
        else{
            data = {
                class: document.getElementById("className").value,
                info: []
            }
        }

        let info = [
                document.getElementById("nickName").value,
                document.getElementById("rollNo").value,
                document.getElementById("regNo").value,
                document.getElementById("mobileNo").value
            ]
        data.info.push(info)

        localStorage.nacStuInfo = JSON.stringify(data);
        createInfoTable(info);

        document.getElementById("nickName").value = "";
        document.getElementById("rollNo").value = "";
        document.getElementById("regNo").value = "";
        document.getElementById("mobileNo").value = "";
        document.getElementById("nickName").focus();
        document.querySelector(".btnDiv").style.display = "inline";
    }

    function seeInfo(className){
        document.getElementById("seeContainer").style.display = "none";
        document.getElementById("footer").style.display = "none";
        document.querySelector(".table").innerHTML = "";
        document.querySelector("#loading").style.display = "block";
        let sheetId = "1LvojQGu-84XINlaY8xDO2HoaqXizzoEe6Mx39WbMoQI";
        let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${className}`;
        fetch(url).then(res => res.text()).then(response => {
        let data = JSON.parse(String(response).substr(47).slice(0, -2)).table.rows;
        // console.log(data)
            if(data.length == 0){
                document.querySelector(".table").innerHTML = "<div style='color: red'>No data found!</div>"
            }
            for(let i = 0; i < data.length; i++){
                let info = [
                    data[i].c[0].v,
                    data[i].c[1].v,
                    data[i].c[2].v,
                    String(data[i].c[3].v).padStart(11, 0)
                ]
                createInfoTable(info);
            }

        document.getElementById("seeContainer").style.display = "block";
        document.getElementById("footer").style.display = "block";
        document.querySelector("#loading").style.display = "none";
        }).catch(err => console.log(err))
    }

    function createInfoTable(info){
        let table = document.querySelector(".table");
        // console.log(table.childNodes.length)
        if(table.childNodes.length == 0){
            let row = document.createElement("div");
            row.setAttribute("class", "row");

            let div = document.createElement("div");
            div.setAttribute("class", "header");
            div.innerText = "Nick Name";
            row.appendChild(div);

            div = document.createElement("div");
            div.setAttribute("class", "header");
            div.innerText = "Roll No.";
            row.appendChild(div);

            div = document.createElement("div");
            div.setAttribute("class", "header");
            div.innerText = "Reg No.";
            row.appendChild(div);

            div = document.createElement("div");
            div.setAttribute("class", "header");
            div.innerText = "Mobile No.";
            row.appendChild(div);
            table.appendChild(row);
        }
        let row = document.createElement("div");
        row.setAttribute("class", "row");
        table.appendChild(row);

        let div = document.createElement("div");
        div.innerText = info[0];
        row.appendChild(div);

        div = document.createElement("div");
        div.innerText = info[1];
        row.appendChild(div);

        div = document.createElement("div");
        div.innerText = info[2];
        row.appendChild(div);

        div = document.createElement("div");
        div.innerText = info[3];
        row.appendChild(div);
    }

    function classCahange(section){
        if(localStorage.nacStuInfo){
            let data = JSON.parse(localStorage.nacStuInfo);
            section.value = data.class;
            document.querySelector(".btn").click();
        }
    }

    function submitData(btn){
        let error = document.querySelector(".error");
        let success = document.querySelector(".success");
        btn.innerText = "submitting...";
        btn.style.background = '#94d3a2';
        btn.style.color ='#eee';
        error.style.display = "none";
        success.style.display = "none";
        document.querySelector("#loading").style.display = "block";
        document.querySelector(".nav").style.display = "block";
        
        let data = JSON.parse(localStorage.nacStuInfo);
        let form = new FormData();
        form.append("class", data.class);
        form.append("data", JSON.stringify(data.info));

        let url = "https://script.google.com/macros/s/AKfycbzd7rdDA1w8ZbmAk9Uxe8WTJ0hrdneEWZi5Pdhy/exec";
        fetch(url, {
            method: "POST",
            mode: "cors",
            header: {
                "Content-Type" : "application/json"
            },
            body: form
        }).then(res => res.text()).then(response => {
                console.log(response)
                response = JSON.parse(response);
                btn.style.background = '';
                btn.style.color = '';
                btn.innerText = 'Submit';
                document.querySelector(".nav").style.display = "none";
                document.getElementById("loading").style.display = "none";
                if(response.result == "success"){
                    success.style.display = "flex";
                    document.querySelector(".table").innerHTML = "";
                    document.querySelector(".btn").style.display = "none";
                    delete localStorage.nacStuInfo;
                }
                else{
                    error.style.display = "flex";
                }
        }).catch(err => {console.log(err)})
    }
}

{
function invokeServiceWorkerUpdateFlow(registration) {
    // TODO implement your own UI notification element
    notification.show("New version of the app is available. Refresh now?");
    notification.addEventListener('click', () => {
        if (registration.waiting) {
            // let waiting Service Worker know it should became active
            registration.waiting.postMessage('SKIP_WAITING')
        }
    })
}

// check if the browser supports serviceWorker at all
if ('serviceWorker' in navigator) {
    // wait for the page to load
    window.addEventListener('load', async () => {
        // register the service worker from the file specified
        const registration = await navigator.serviceWorker.register('./sw.js')

        // ensure the case when the updatefound event was missed is also handled
        // by re-invoking the prompt when there's a waiting Service Worker
        if (registration.waiting) {
            invokeServiceWorkerUpdateFlow(registration)
        }

        // detect Service Worker update available and wait for it to become installed
        registration.addEventListener('updatefound', () => {
            if (registration.installing) {
                // wait until the new Service worker is actually installed (ready to take over)
                registration.installing.addEventListener('statechange', () => {
                    if (registration.waiting) {
                        // if there's an existing controller (previous Service Worker), show the prompt
                        if (navigator.serviceWorker.controller) {
                            invokeServiceWorkerUpdateFlow(registration)
                        } else {
                            // otherwise it's the first install, nothing to do
                            console.log('Service Worker initialized for the first time')
                        }
                    }
                })
            }
        })

        let refreshing = false;

        // detect controller change and refresh the page
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                window.location.reload()
                refreshing = true
            }
        })
    })
}
}