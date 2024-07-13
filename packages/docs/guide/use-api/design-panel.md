---
layout: page
---

<script setup lang="ts">
import { inBrowser } from 'vitepress'; 
import { computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vitepress';
const { go } = useRouter();

const DesignPanel = computed(()=>{
    if(inBrowser){
        return defineAsyncComponent(async ()=>{
            const module = await import('@myprint/design');
            return module.DesignPanel;
        });
    } else {
        return  null;
    }
});

</script>

<design-panel class="design-panel" :showBackButton="false" :template="null!" @back="go('guide/use-api/api-example')" 
:module="{
    provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'} as Provider),
    previewData: '[{}]'
}"/>

<style lang="css">
.design-panel{
height: calc(100vh - 64px);
}
</style>
