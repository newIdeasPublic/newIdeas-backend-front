<template>
  <society-detail :is-edit="false" />
</template>

<script>
import SocietyDetail from './components/SocietyDetail'

export default {
  name: 'CreateSociety',
  components: { SocietyDetail }
}
</script>

