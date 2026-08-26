import React, { useState, useEffect } from "react";
import { usuariosService } from "../services/usuariosService";
import type { Usuario } from "../services/usuariosService";
import { UsuarioModal } from "../components/UsuarioModal";

export const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredBtnNuevo, setHoveredBtnNuevo] = useState<boolean>(false);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        const data = await usuariosService.listar();
        setUsuarios(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const handleGuardarUsuario = async (nuevoUsuario: Usuario) => {
    const usuarioCreado = await usuariosService.crear(nuevoUsuario);

    setUsuarios([...usuarios, usuarioCreado]);
  };

  if (cargando)
    return <div style={styles.centro}>Cargando panel de biblioteca...</div>;
  if (error)
    return <div style={{ ...styles.centro, color: "#ef4444" }}>{error}</div>;

  return (
    <div style={styles.contenedorConFondo}>
      <div style={styles.overlayOscuro}>
        <div style={styles.contenidoInterno}>
          {/* Fila de Indicadores con sombras y bordes suavizados */}
          <div style={styles.kpiGrid}>
            <div style={styles.kpiCardCristal}>
              <div>
                <p style={styles.kpiTitulo}>Usuarios Afiliados</p>
                <h3 style={styles.kpiNumero}>{usuarios.length}</h3>
              </div>
              <span style={styles.kpiIcono}>👥</span>
            </div>
            <div style={styles.kpiCardCristal}>
              <div>
                <p style={styles.kpiTitulo}>Libros en Reserva</p>
                <h3 style={styles.kpiNumero}>--</h3>
              </div>
              <span style={styles.kpiIcono}>📖</span>
            </div>
            <div style={styles.kpiCardCristal}>
              <div>
                <p style={styles.kpiTitulo}>Préstamos Activos</p>
                <h3 style={styles.kpiNumero}>--</h3>
              </div>
              <span style={styles.kpiIcono}>⏳</span>
            </div>
          </div>

          {/* Tarjeta de la Tabla Principal */}
          <div style={styles.cardTablaCristal}>
            <div style={styles.encabezado}>
              <div>
                <h2 style={styles.tituloSeccion}>Lectores Registrados</h2>
                <p style={styles.subtituloSeccion}>
                  Listado oficial de miembros con acceso a préstamos de
                  ejemplares.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  ...styles.botonNuevo,
                  backgroundColor: hoveredBtnNuevo ? "#a15c11" : "#854d0e",
                  transform: hoveredBtnNuevo ? "translateY(-1px)" : "none",
                }}
                onMouseEnter={() => setHoveredBtnNuevo(true)}
                onMouseLeave={() => setHoveredBtnNuevo(false)}
              >
                + Registrar Lector
              </button>
            </div>

            {usuarios.length === 0 ? (
              <p style={styles.vacioText}>
                No hay lectores registrados en el sistema de biblioteca.
              </p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.tabla}>
                  <thead>
                    <tr style={styles.filaHeader}>
                      <th style={styles.th}>Nombre</th>
                      <th style={styles.th}>Apellido</th>
                      <th style={styles.th}>Correo Electrónico</th>
                      <th style={styles.th}>Fecha de Nacimiento</th>
                      <th style={styles.th}>Acciones de Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario, index) => (
                      <tr
                        key={usuario.id}
                        style={{
                          ...styles.filaBody,
                          backgroundColor:
                            hoveredRow === index ? "#f8fafc" : "transparent",
                        }}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={styles.tdNombre}>{usuario.nombre}</td>
                        <td style={styles.td}>{usuario.apellido}</td>
                        <td style={styles.td}>{usuario.email}</td>
                        <td style={styles.td}>{usuario.fechaNacimiento}</td>
                        <td style={styles.td}>
                          <button style={styles.botonEditar}>⚙️ Editar</button>
                          <button style={styles.botonEliminar}>
                            🗑️ Dar de baja
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Componente del Formulario Emergente */}
      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGuardar={handleGuardarUsuario}
      />
    </div>
  );
};

const styles = {
  contenedorConFondo: {
    backgroundImage: `url('https://unsplash.com')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100%",
  },
  overlayOscuro: {
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    minHeight: "100vh",
    width: "100%",
  },
  contenidoInterno: {
    padding: "40px 32px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  kpiCardCristal: {
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
  },
  kpiTitulo: {
    margin: 0,
    fontSize: "13px",
    color: "#475569",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  kpiNumero: {
    margin: "6px 0 0 0",
    fontSize: "34px",
    color: "#0f172a",
    fontWeight: "800",
  },
  kpiIcono: {
    fontSize: "24px",
    backgroundColor: "rgba(133, 77, 14, 0.1)",
    padding: "12px",
    borderRadius: "14px",
    color: "#854d0e",
  },
  cardTablaCristal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  encabezado: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 32px",
    borderBottom: "1px solid #f1f5f9",
  },
  tituloSeccion: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtituloSeccion: { fontSize: "14px", color: "#64748b", margin: "6px 0 0 0" },
  botonNuevo: {
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 4px 14px rgba(133, 77, 14, 0.35)",
    transition: "all 0.2s ease-in-out",
  },
  tableWrapper: { overflowX: "auto" as const },
  tabla: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
  },
  filaHeader: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #edf2f7",
    textAlign: "left" as const,
  },
  th: {
    padding: "18px 24px",
    color: "#475569",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
  filaBody: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.15s ease",
  },
  td: { padding: "18px 24px", color: "#334155" },
  tdId: { padding: "18px 24px", fontWeight: "bold" as const, color: "#94a3b8" },
  tdNombre: {
    padding: "18px 24px",
    fontWeight: "600" as const,
    color: "#1e293b",
  },
  botonEditar: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    border: "none",
    padding: "6px 14px",
    marginRight: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "background-color 0.2s",
  },
  botonEliminar: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "background-color 0.2s",
  },
  vacioText: {
    padding: "40px",
    textAlign: "center" as const,
    color: "#64748b",
    fontSize: "15px",
  },
  centro: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#0f172a",
    fontFamily: "system-ui",
  },
};
