<script setup>
import { ref, onMounted, getCurrentInstance, unref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
let router = useRouter()
let instance = getCurrentInstance()

onMounted(() => {
  getData()
})

let data = ref([])
let modalData = ref({})

async function getData() {
  data = await axios
    .post(`http://localhost:3000/dynamic`, {
      query: `SELECT drivers_info.*, users.email FROM users JOIN drivers_info ON users.id = drivers_info.user_id WHERE users.role = 'driver'`
    })
    .then((res) => {
      return res.data
    })
  instance?.proxy?.$forceUpdate()
}

async function deleteRow(id) {
  await axios.delete(`http://localhost:3000/api/users/${id}`).then((res) => {})
  getData()
}

function openNew() {
  this.modalData = {}
  this.modalData.title = 'Добавить водителя'
  this.modalData.content = ref([])
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()

  today = mm + '/' + dd + '/' + yyyy
  this.modalData.arrival_date = ref(today)
  $('#editModal').modal('show')
}

async function edit(id) {
  this.modalData = {}

  let driver = await axios
    .get(`http://localhost:3000/api/drivers_info?_where=(id,eq,${id})`)
    .then((res) => {
      return res.data[0]
    })
  let user_data = await axios
    .get(`http://localhost:3000/api/users?_where=(id,eq,${driver['user_id']})`)
    .then((res) => {
      return res.data[0]
    })
  this.modalData = driver
  this.modalData.email = user_data.email
  this.modalData.password = user_data.password
  this.modalData.title = 'Изменить данные водителя'
  $('#editModal').modal('show')
}
function deleteContent(id) {
  this.modalData.content.splice(id, 1)
}

async function saveForm() {
  await axios.post('http://localhost:3000/api/users', {
    email: unref(unref(modalData).email),
    password: unref(unref(modalData).password),
    role: 'driver'
  })
  let last = await axios.get('http://localhost:3000/api/users?_sort=-id').then((res) => {
    return res.data[0]
  })
  axios.post('http://localhost:3000/api/drivers_info', {
    user_id: last['id'],
    fullname: unref(unref(modalData).fullname),
    passport: unref(unref(modalData).passport),
    birth: unref(unref(modalData).birth),
    car_id: unref(unref(modalData).car_id),
    phone: unref(unref(modalData).phone)
  })
  $('#editModal').modal('hide')
  getData()
}
</script>

<template>
  <navbar></navbar>
  <main class="pt-2 px-3">
    <button class="btn btn-primary" @click="openNew()">Добавить водителя</button>
    <br />
    <br />
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Дата рождения</th>
          <th style="width: 0" class="pe-5"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td scope="col">{{ item.id }}</td>
          <td scope="col">{{ item.fullname }}</td>
          <td scope="col">{{ item.email }}</td>
          <td scope="col">{{ item.phone }}</td>
          <td scope="col">{{ item.birth }}</td>
          <td class="d-flex flex-row gap-2 justify-content-center align-items-center">
            <button class="btn-close" @click="deleteRow(item.id)"></button>
            <button class="btn btn-primary" @click="edit(item.id)">Просмотр</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <div class="modal fade" id="editModal" tabindex="-1" role="dialog" v-show="modalData.title">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalData.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Имя</label>
              <input type="text" class="form-control" v-model="modalData.fullname" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="modalData.email" />
            </div>
            <div class="mb-3">
              <label class="form-label">Пароль</label>
              <input type="text" class="form-control" v-model="modalData.password" />
            </div>
            <div class="mb-3">
              <label class="form-label">Телефон</label>
              <input type="text" class="form-control" v-model="modalData.phone" />
            </div>
            <div class="mb-3">
              <label class="form-label">Номер паспорта</label>
              <input type="text" class="form-control" v-model="modalData.passport" />
            </div>
            <div class="mb-3">
              <label class="form-label">Дата рождения</label>
              <input type="date" class="form-control" v-model="modalData.birth" />
            </div>

            <div class="mb-3">
              <label class="form-label">Авто</label>
              <select class="form-select" v-model="modalData.car_id">
                <option value="undefined" disabled v-if="!modalData.car_id">
                  --Выберите доступный автомобиль--
                </option>
                <option value="null" disabled v-if="modalData.car_id">
                  --Выберите доступный автомобиль--
                </option>
                <option v-for="item in modalData.availableCars">{{ item.label }}</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer" v-if="!modalData.id">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="saveForm">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>
