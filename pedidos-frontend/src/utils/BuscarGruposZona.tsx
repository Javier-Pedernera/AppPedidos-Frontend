

import { GrupoGet } from "../Models/GrupoGet";
import Zona from "../Models/Zona";

const buscarGruposConZonasAsignadas = (zonas: Zona[], grupos: GrupoGet[]): GrupoGet[] => {
  const gruposConZonasAsignadas: GrupoGet[] = [];

  grupos.forEach(grupo => {
    
    console.log(" zonas y grupo. id_zona",zonas , grupos);
    if (zonas.some(zona => zona.id === grupo.zona.id)) {

      gruposConZonasAsignadas.push(grupo);
    }
  });

  return gruposConZonasAsignadas;
};

export default buscarGruposConZonasAsignadas;