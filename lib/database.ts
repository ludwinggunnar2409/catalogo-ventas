import { supabase } from "./supabase";
import type { Producto, Empresa, Categoria } from "@/types/database";

// Obtener todas las empresas activas
export async function getEmpresasActivas(): Promise<Empresa[]> {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("is_active", true)
    .order("nombre");

  if (error) {
    console.error("Error al obtener empresas:", error);
    return [];
  }

  return data as Empresa[];
}

// Obtener todas las categorías activas
export async function getCategoriasActivas(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("is_active", true)
    .order("nombre");

  if (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }

  return data as Categoria[];
}

// Obtener productos activos (con joins opcionales)
export async function getProductosActivos(
  includeEmpresa: boolean = false,
  includeCategoria: boolean = false
): Promise<Producto[]> {
  let query = supabase
    .from("productos")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Si necesitamos joins, usamos el formato de Supabase
  if (includeEmpresa && includeCategoria) {
    query = query.select(`
      *,
      empresa:empresas(*),
      categoria:categorias(*)
    `);
  } else if (includeEmpresa) {
    query = query.select(`
      *,
      empresa:empresas(*)
    `);
  } else if (includeCategoria) {
    query = query.select(`
      *,
      categoria:categorias(*)
    `);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }

  return data as Producto[];
}

// Agrega estas funciones nuevas:

// Obtener productos con filtros
export async function getProductosFiltrados(filters?: {
  empresaId?: string;
  categoriaId?: string;
}): Promise<Producto[]> {
  let query = supabase
    .from('productos')
    .select('*, empresa:empresas(*), categoria:categorias(*)')
    .eq('is_active', true);

  if (filters?.empresaId) {
    query = query.eq('empresa_id', filters.empresaId);
  }

  if (filters?.categoriaId) {
    query = query.eq('categoria_id', filters.categoriaId);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error al obtener productos filtrados:', error);
    return [];
  }

  return data as Producto[];
}

// Contar productos por empresa
export async function getProductosCountByEmpresa(empresaId: string): Promise<number> {
  const { count, error } = await supabase
    .from('productos')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)
    .eq('is_active', true);

  if (error) {
    console.error('Error al contar productos por empresa:', error);
    return 0;
  }

  return count || 0;
}

// Contar productos por categoría
export async function getProductosCountByCategoria(categoriaId: string): Promise<number> {
  const { count, error } = await supabase
    .from('productos')
    .select('*', { count: 'exact', head: true })
    .eq('categoria_id', categoriaId)
    .eq('is_active', true);

  if (error) {
    console.error('Error al contar productos por categoría:', error);
    return 0;
  }

  return count || 0;
}