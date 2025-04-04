<template>
  <div>home</div>
  <button @click="signOut">signout</button>
</template>

<script setup>
const { signOut, status } = useAuth();

watchEffect(() => {
  if (status.value === 'authenticated') {
    console.log('User is authenticated');
  } else {
    console.log('User is not authenticated');
  }
});
</script>
