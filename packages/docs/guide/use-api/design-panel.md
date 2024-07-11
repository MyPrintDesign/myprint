<script setup lang="ts">
import { DesignPanel } from '@myprint/design';
</script>

<design-panel :template="null!" :module="{
provider: JSON.stringify({width: 100, height: 100, pageUnit: 'mm'} as Provider),
previewData: '[{}]'
}"/>
