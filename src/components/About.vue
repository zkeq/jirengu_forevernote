<template>
    <div>
        <h1>About</h1>
        <p>This is an about page</p>
        <p>Count: {{ count }}</p>
        <button @click="addCount()">AddCount</button>
        
    </div>
</template>

<script>

export default {
    name: 'About',
    data() {
        return {
            count: 0
        }
    },
    methods: {
        addCount() {
            this.count++
        }
    }
}

</script>