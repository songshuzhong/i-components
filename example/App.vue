<template>
  <div>
    <richtxt :props="{
      name: 'sadf'
    }"/>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {Richtxt} from '../src/components/Richtxt/index.js';
import {Workflow} from '../src/components/Workflow/index.js';
import {Qrcode} from '../src/components/Qrcode/index.js';
import {Driver} from '../src/components/Driver/index.js';
import {Watermark} from '../src/components/Watermark/index.js';
import {Extable} from '../src/components/Extable/index.js';
import {Player} from '../src/components/Player/index.js';

export default defineComponent({
  name: 'Application',
  components: {
    Workflow,
    Richtxt,
    Qrcode,
    Driver,
    Watermark,
    Extable,
    Player
  }
});
</script>
