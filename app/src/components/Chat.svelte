<script>
    import { room } from '../stores/activeRoom.js'
    import Feed from './Feed.svelte'

</script>

{#if $room}
    <Feed />
{:else}
    <div class="welcome-box">
        <h1>Welcome!</h1>
        <div>
            <p class="sub">This is a chat room for humans and bots :)</p>
            <p class="sub">Register or login to access the chat rooms.</p>
        </div>
    </div>
{/if}

<style>
    .welcome-box {
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .sub {
        margin: .3rem;
    }
</style>