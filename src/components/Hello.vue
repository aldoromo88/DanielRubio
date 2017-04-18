<template>
<div class="col-xs-12">
  <!-- <div class="row">
    <div class="col-xs-12 col-sm-8 col-md-6 col-lg-4">
      Categorias:
      <Multiselect :options="Categories" v-model="CurrentCategories" :limit="2" :limit-text="moreElements" :allow-empty="true" select-label="Enter para agregar" selected-label="Seleccionado" deselect-label="Enter para quitar" :multiple="true" :close-on-select="false"
          placeholder=" ">
      </Multiselect>
    </div>
  </div> -->
  <div class="row">
    <div class="col-xs-12">
      <GridLayout :Items="Projects" :Filter="CurrentCategories" :ColumnsPerRow="ColumnsPerRow" :Height="Height" :InfoCellSize="InfoCellSize">
        <div>
          <div class="title">
            <h3 style="text-align:left">Daniel C. Rubio</h3>
          </div>
          <div class="imgPlaceHolder">
            <p>
              <b>Daniel C. Rubio</b> tiene el objetivo de inspirar al empresario con diseños que presenten el prestigio y la calidad competente que tiene el producto, empresa o servicio ante el mercado globalizado.
            </p>

            <p>
              Todo proyecto, chico o grande, es capaz de tener un nivel internacional.
            </p>
            Categorias:
            <Multiselect :options="Categories" v-model="CurrentCategories" :limit="2" :limit-text="moreElements" :allow-empty="true" select-label="Enter para agregar" selected-label="Seleccionado" deselect-label="Enter para quitar" :multiple="true" :close-on-select="false" placeholder=" ">
            </Multiselect>
          </div>
        </div>
      </GridLayout>
    </div>
  </div>
</div>
</template>

<script>
import projects from 'src/data/projects.json'
import _ from 'underscore';
import enquire from 'enquire.js';
import Multiselect from 'vue-multiselect'
import GridLayout from './GridLayout'

export default {
  name: 'hello',
  data() {
    return {
      Categories: ['Branding', 'Imagen', 'Diseño', 'Concurso'],
      CurrentCategories: ['Branding', 'Imagen', 'Diseño', 'Concurso'],
      Projects: projects.map(p => {
        let name = p.name.toLowerCase().replace(' ', '_');
        p.images = _.range(1, 6).map(i => `projects/${name}/png/${name}_${('00'+i).slice(-2)}.png`);
        p.defaultImage = `url(projects/${name}/png/${name}_01.png)`;
        return p;
      }),
      CurrentProject: undefined,
      Height: 300,
      ColumnsPerRow: 3,
      InfoCellSize: 2
    }
  },
  methods: {
    moreElements(n) {
      return `${n} más`
    }
  },
  mounted() {
    enquire.register("screen and (max-width: 40em)", () => {
      this.ColumnsPerRow = 1;
      this.InfoCellSize = 1;
    });
    enquire.register("screen and (min-width: 40.063em) and (max-width: 64em)", () => {
      this.ColumnsPerRow = 2;
      this.InfoCellSize = 2;
    });
    enquire.register("screen and (min-width: 64.063em) and (max-width: 90em)", () => {
      this.ColumnsPerRow = 3;
      this.InfoCellSize = 2;
    });
    enquire.register("screen and (min-width: 90.063em)", () => {
      this.ColumnsPerRow = 4;
      this.InfoCellSize = 3;
    });
  },
  components: {
    Multiselect,
    GridLayout
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
