using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PruebaNet8.ENTITY;

namespace PruebaNet8.DAL;

public partial class PruebaIdentityProyectoContext : IdentityDbContext<IdentityUser>
{

    public PruebaIdentityProyectoContext(DbContextOptions<PruebaIdentityProyectoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Configuracion> Configuraciones { get; set; }

    public virtual DbSet<ImagenesProducto> ImagenesProductos { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC075079138D");

            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Configuracion>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Propiedad)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Recurso)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Valor)
                .HasMaxLength(60)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ImagenesProducto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Imagenes__3214EC07DD91B705");

            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.UrlImagen)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.IdProductoNavigation).WithMany(p => p.ImagenesProductos)
                .HasForeignKey(d => d.IdProducto)
                .HasConstraintName("FK__ImagenesP__IdPro__403A8C7D");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Producto__3214EC07053C4CCD");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Marca)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuario__5B65BF971DDCD808");

            entity.ToTable("Usuario");

            entity.Property(e => e.ClaveUsuario)
                .HasMaxLength(75)
                .IsUnicode(false);
            entity.Property(e => e.NombreUsuario)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(l => new { l.LoginProvider, l.ProviderKey, l.UserId });

        modelBuilder.Entity<IdentityUserRole<string>>(i =>
        {
            i.HasKey(x => new { x.UserId, x.RoleId });
            // Otras configuraciones si es necesario
        });
        OnModelCreatingPartial(modelBuilder);

        modelBuilder.Entity<IdentityUserToken<string>>(i =>
        {
            i.HasKey(x => new { x.UserId, x.LoginProvider, x.Name });
            // Otras configuraciones si es necesario
        });
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
