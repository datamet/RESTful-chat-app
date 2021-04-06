<script>
    import { auth } from '../stores/auth.js'
    import RoomsList from './RoomsList.svelte'
    
</script>

<aside>
    {#if $auth}
        <RoomsList />
    {:else}
        <div class="login-message">
            <p>Log in to view rooms...</p>
        </div>
    {/if}
</aside>

<style>
    aside {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 34rem;
        background-color: rgb(243, 243, 243);
        overflow-y: scroll;
        box-shadow: 0 0 1rem 0 lightgray;
        position: relative;
        z-index: 100;
    }

    aside::-webkit-scrollbar {
        display: none;
    }

    .login-message {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>