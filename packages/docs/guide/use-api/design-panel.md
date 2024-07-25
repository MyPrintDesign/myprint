---
layout: page
---

<script setup lang="ts">
import { inBrowser } from 'vitepress'; 
import { computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vitepress'; 
import { template } from '../../examples/constant.js'; 

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

<design-panel class="design-panel_tmp"
:showBackButton="false"
:template="template"
@back="go('guide/use-api/api-example')"
:module="{
provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'} as Provider),
previewData: '[{}]'
}"/>

<style lang="css">
.design-panel_tmp{
    height: calc(100vh - 64px) !important;
}
</style>
