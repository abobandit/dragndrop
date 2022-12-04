const orderContainer = document.getElementById('order-container')
const inProcess = document.getElementById('in-process')
const finished = document.getElementById('finished')
const orderList = document.getElementsByClassName('order')[0]
const btn = document.querySelector(".adder")
const name = document.querySelector('#name')
const order = document.querySelector('#order')

btn.addEventListener('click', (evt) => {
    if (name.value.length >= 2 && order.value.length >= 5) {
        let curTime = new Date()
        curTime = curTime.getDay() + '.' + curTime.getMonth() + '.' + curTime.getFullYear() + ' ' + curTime.getHours() + ':' + curTime.getMinutes()+':' +  curTime.getSeconds()
        const orderItem = document.createElement('li')
        orderItem.className = 'order-item'
        orderItem.innerHTML = `<p class="m-0">${order.value}</p><span class="orderer"><span class="name">${name.value}</span> <span class="date">${curTime}</span></span>`
        orderList.appendChild(orderItem)
    } else alert('Имя должно состоять минимум из двух символов а сообщение из 6')
    name.value = null
    order.value = null
})
orderContainer.onmousedown = function (e) {
    let orderWidth = orderList.getBoundingClientRect().width + 'px'
    let eT = e.target.closest('.order-item')
    if (!eT) return
    if (!this.contains(eT)) return
    let coords = getCoords(eT)
    let shiftX = e.pageX - coords.left
    let shiftY = e.pageY - coords.top
    eT.style.position = 'absolute'
    eT.style.width = orderWidth
    eT.style.borderRadius = '10px'
    moveAt(e)
    eT.style.zIndex = 1000; // над другими элементами
    function moveAt(e) {
        eT.style.left = e.pageX - shiftX / 2 + 'px';
        eT.style.top = e.pageY - shiftY / 2 + 'px';
    }
    document.onmousemove = function (e) {
        eT.style.outline = '1px solid red'
        moveAt(e);
    }
    eT.onmouseup = function (evt) {
        function upDate(){
            let curTime = new Date()
            curTime = curTime.getDay() + '.' + curTime.getMonth() + '.' + curTime.getFullYear() + ' ' + curTime.getHours() + ':' + curTime.getMinutes() + ':' + curTime.getSeconds()
            eT.querySelector('.date').innerText = curTime
        }
        let elemCoords = eT.getBoundingClientRect()
        let appenderForward = (a, b) => {
            let aCoords = a.getBoundingClientRect()
            if (b.contains(eT)) {
                if (aCoords.top <= elemCoords.bottom - shiftY / 2 && aCoords.right >= elemCoords.left - shiftX / 2 && aCoords.bottom >= elemCoords.top - shiftY / 2 && aCoords.left <= elemCoords.right - shiftX / 2) {
                    a.prepend(eT)
                    upDate()
                }
            }
            eT.style.position = 'static'
            eT.style.outline = 'none'
            eT.style.width = '100%'
        }
        appenderForward(inProcess, orderList)
        appenderForward(finished, inProcess)
        appenderForward(inProcess, finished)

        document.onmousemove = null
        eT.onmouseup = null
    }
    eT.ondragstart = function () {
        return false;
    }
    function getCoords(elem) {   // кроме IE8-
        let box = elem.getBoundingClientRect()
        return {
            top: box.top + scrollY,
            left: box.left + scrollX,
            bottom: box.bottom + scrollY,
            right: box.right + scrollX
        }
    }
}