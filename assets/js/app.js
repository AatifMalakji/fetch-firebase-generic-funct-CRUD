const cl = console.log

const form = document.getElementById('form')
const title = document.getElementById('title')
const content = document.getElementById('content')
const submitbtn = document.getElementById('submitbtn')
const updatebtn = document.getElementById('updatebtn')
const postcontainer = document.getElementById('postcontainer')
const loader = document.getElementById('loader')



const snackbar = (msg, i)=>{
Swal.fire({
    title : msg,
    icon : i,
    timer : 1000
})
}

const BASE_URL = `https://fetch-crud-7ef78-default-rtdb.firebaseio.com`
const POST_URL = `${BASE_URL}/posts.json`

const apicall = (url, method, body) => {
    loader.classList.remove('d-none')
    body = body ? JSON.stringify(body) : null
 return fetch(url, {
    method : method,
    body : body,
    headers: {
    'content-type' : 'application/json',
    Authorization: ''
    }
})
.then(res => res.json())
.catch(err => snackbar('Something Went Wrong', 'error'))
.finally(() => loader.classList.add('d-none'))
}
const createpost = (arr) => {
    let result = ''
    arr.forEach(p => {
        result += ` <div class="col-md-4 mb-3" id="${p.id}">
                 <div class="card h-100">
                <div class="card-header">
                    ${p.title}
                </div>
                <div class="card-body">
                   ${p.body} 
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-outline-info" onclick="onedit(this)">Edit</button>
                    <button class="btn btn-outline-warning" onclick="onremove(this)">Remove</button></div>
            </div>
            </div>`
    })
    postcontainer.innerHTML = result
}
const fetchpost = () =>{
apicall(POST_URL, 'GET', null)
.then(data => {
    let arr = []
    for(const key in data){
      arr.push({...data[key], id: key})
    }
    createpost(arr.reverse())

})
}
fetchpost()

const onedit = (e)=>{
    let editid = e.closest('.col-md-4').id
    localStorage.setItem('editid', editid)
    let EDIT_URL = `${BASE_URL}/posts/${editid}.json`
    apicall(EDIT_URL, 'GET')
    .then(data => {
        title.value = data.title
        content.value = data.body
        submitbtn.classList.add('d-none')
        updatebtn.classList.remove('d-none')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}
const onupdate = ()=>{
    let updateid=  localStorage.getItem('editid')
    let updatedobj = {
        title : title.value,
        body : content.value
    }
    let UPDATE_URL = `${BASE_URL}/posts/${updateid}.json`
    apicall(UPDATE_URL, 'PATCH', updatedobj)
    .then(res => {
        let div = document.getElementById(updateid)
        div.querySelector('.card-header').innerHTML = updatedobj.title
        div.querySelector('.card-body').innerHTML = updatedobj.body
snackbar('Updated Successfully', 'success')
window.scrollTo({top: div.offsetTop, behavior: "smooth"})
    })
    form.reset()
    submitbtn.classList.remove('d-none')
    updatebtn.classList.add('d-none')
    
}
const onremove = (e)=>{
    Swal.fire({
        title: "Are you sure want to remove?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Remove",
        denyButtonText: `Don't Remove`
      }).then((result) => {
        if (result.isConfirmed) {
            let removeid = e.closest('.col-md-4').id
            let REMOVE_URL = `${BASE_URL}/posts/${removeid}.json`
            apicall(REMOVE_URL, 'DELETE')
            .then(res => {
                document.getElementById(removeid).remove()
                snackbar('Removed Successfully', 'success')
            })
        } else if (result.isDenied) {
          Swal.fire("Post is not Removed", "", "info");
        }
      });
//     let getconfirm = confirm('Are you Sure want to remove?')
//    if(getconfirm){
 
//    }
  
}
const onsubmit = (e) =>{
    e.preventDefault()
    let obj = {
        title : title.value,
        body : content.value
    }
    apicall(POST_URL,'POST',obj )
    .then(res => {
        let div = document.createElement('div')
        div.className = 'col-md-4 mb-3'
        div.id = res.id
        div.innerHTML = `  <div class="card h-100">
                <div class="card-header">
                    ${obj.title}
                </div>
                <div class="card-body">
                   ${obj.body} 
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-outline-info" onclick="onedit(this)">Edit</button>
                    <button class="btn btn-outline-warning" onclick="onremove(this)">Remove</button></div>
            </div>`
            postcontainer.prepend(div)
            snackbar('Post Added Successfully!', 'success')
    })
form.reset()
} 




updatebtn.addEventListener('click', onupdate)
form.addEventListener('submit', onsubmit)