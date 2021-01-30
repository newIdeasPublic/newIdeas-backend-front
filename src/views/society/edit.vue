<template>
  <society-detail :is-edit="true" />
</template>

<script>
import SocietyDetail from './components/SocietyDetail'

export default {
  name: 'EditForm',
  components: { SocietyDetail }
}
</script>

