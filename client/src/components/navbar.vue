<template>
  <div class="d-flex flex-row justify-content-between mt-2">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <RouterLink active-class="active" to="/stock" class="nav-link" aria-current="page"
          >Склад</RouterLink
        >
      </li>
      <li class="nav-item">
        <RouterLink active-class="active" to="/drivers" class="nav-link">Водители</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink active-class="active" to="/cars" class="nav-link">Машины</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink active-class="active" to="/stock" class="nav-link">Маршруты</RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink active-class="active" to="/stock" class="nav-link">Пользователи</RouterLink>
      </li>
    </ul>
    <RouterLink to="/" class="btn btn-primary">Выход</RouterLink>
  </div>
</template>
