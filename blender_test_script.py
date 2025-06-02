# blender_test_script.py (corrigé)

import bpy
import sys
import os
import time

def main():
    print("Blender script started.")
    print(f"Blender version: {bpy.app.version_string}")
    print(f"Script path: {__file__}")
    print(f"Current working directory: {os.getcwd()}")

    # --- 1. Récupérer les arguments de la ligne de commande ---
    argv = sys.argv
    input_image_path_rel = None
    output_path_rel = None
    # output_filename = args.output_path # Cette ligne semblait être une erreur/typo ou non utilisée.

    try:
        # Chercher les arguments après le séparateur "--"
        args_after_double_dash = argv[argv.index("--") + 1:] if "--" in argv else []

        if "--input_image_path" in args_after_double_dash:
            idx_input = args_after_double_dash.index("--input_image_path") + 1
            if idx_input < len(args_after_double_dash):
                input_image_path_rel = args_after_double_dash[idx_input]
            else:
                print("Erreur: Valeur manquante pour --input_image_path")
                raise ValueError("Valeur manquante pour --input_image_path")
        else:
            print("Erreur: Argument --input_image_path manquant")
            raise ValueError("Argument '--input_image_path' manquant")

        if "--output_path" in args_after_double_dash:
            idx_output = args_after_double_dash.index("--output_path") + 1
            if idx_output < len(args_after_double_dash):
                output_path_rel = args_after_double_dash[idx_output]
            else:
                print("Erreur: Valeur manquante pour --output_path")
                raise ValueError("Valeur manquante pour --output_path")
        else:
            print("Erreur: Argument --output_path manquant")
            raise ValueError("Argument '--output_path' manquant")

    except ValueError as e:
        print(f"Erreur lors de la lecture des arguments: {e}")
        bpy.ops.wm.quit_blender() # Quitter Blender en cas d'erreur d'argument
        return

    print(f"Raw input_image_path (filename): {input_image_path_rel}")
    print(f"Raw output_path (filename): {output_path_rel}")

    # --- CORRECTION DES CHEMINS ---
    # Les répertoires de base à l'intérieur du conteneur, basés sur les mappings de volume Docker
    CONTAINER_INPUT_BASE_DIR = "/app/input_texture"
    CONTAINER_OUTPUT_BASE_DIR = "/app/output_renders"

    input_image_path = os.path.join(CONTAINER_INPUT_BASE_DIR, input_image_path_rel)
    # Pour le chemin de sortie, os.path.join s'assurera qu'il est correctement formé
    # même si output_path_rel contient des sous-dossiers (bien que ce ne soit pas le cas ici)
    output_path = os.path.join(CONTAINER_OUTPUT_BASE_DIR, output_path_rel)
    # --- FIN DE LA CORRECTION DES CHEMINS ---

    print(f"Using absolute input_image_path: {input_image_path}")
    print(f"Using absolute output_path: {output_path}")

    # --- 2. Nettoyer la scène par défaut ---
    bpy.ops.object.select_all(action='SELECT')
    if bpy.context.selected_objects:
        bpy.ops.object.delete()
        print(f"Scène nettoyée, objets supprimés.")
    else:
        print("Aucun objet à supprimer dans la scène initiale.")

    # --- 3. Créer un objet à texturer (plan) ---
    print("Création d'un plan...")
    bpy.ops.mesh.primitive_plane_add(size=2, enter_editmode=False, align='WORLD', location=(0, 0, 0))
    plane = bpy.context.active_object
    if not plane:
        print("Erreur: Impossible de créer ou de trouver le plan.")
        bpy.ops.wm.quit_blender()
        return
    plane.name = "ImagePlane"
    print(f"Plan '{plane.name}' créé.")

    # --- 4. Créer et configurer un material ---
    print("Création et configuration du material...")
    mat = bpy.data.materials.new(name="ImageMaterial")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in list(nodes): # Utiliser list(nodes) pour éviter les problèmes de modification pendant l'itération
        nodes.remove(node)
    shader_node_principled = nodes.new(type='ShaderNodeBsdfPrincipled')
    shader_node_principled.location = (0,0)
    tex_image_node = nodes.new(type='ShaderNodeTexImage')
    tex_image_node.location = (-300, 0)
    output_node = nodes.new(type='ShaderNodeOutputMaterial')
    output_node.location = (300,0)
    links.new(tex_image_node.outputs['Color'], shader_node_principled.inputs['Base Color'])
    links.new(shader_node_principled.outputs['BSDF'], output_node.inputs['Surface'])
    if plane.data.materials:
        plane.data.materials[0] = mat
    else:
        plane.data.materials.append(mat)
    print("Material créé et assigné.")

    # --- 5. Charger l'image et l'appliquer ---
    print(f"Tentative de chargement de l'image: {input_image_path}")
    try:
        if not os.path.exists(input_image_path):
            print(f"ERREUR FATALE: Le fichier image d'entrée n'existe pas: {input_image_path}")
            bpy.ops.wm.quit_blender()
            return
        img = bpy.data.images.load(input_image_path, check_existing=True)
        tex_image_node.image = img
        print(f"Image '{os.path.basename(img.filepath)}' chargée et appliquée au node Image Texture.") # Utiliser basename pour le nom
    except RuntimeError as e:
        print(f"Erreur RuntimeError lors du chargement de l'image ou de son application : {e}")
        bpy.ops.wm.quit_blender()
        return
    except Exception as e:
        print(f"Erreur inattendue lors du traitement de l'image : {e}")
        bpy.ops.wm.quit_blender()
        return

    # --- 6. Configurer la caméra ---
    print("Configuration de la caméra...")
    if not bpy.data.objects.get("Camera"):
        bpy.ops.object.camera_add(location=(0, -3, 2)) # Ajuster selon le besoin
        camera_obj = bpy.context.active_object
        camera_obj.name = "Camera"
        # Orienter la caméra pour regarder l'origine (0,0,0) depuis sa position
        # Vous pouvez utiliser look_at ou ajuster la rotation manuellement
        camera_obj.rotation_euler[0] = 1.10714872 # environ 63.4 degrés
        camera_obj.rotation_euler[1] = 0
        camera_obj.rotation_euler[2] = 0
    else:
        camera_obj = bpy.data.objects["Camera"]
    scene = bpy.context.scene
    scene.camera = camera_obj
    print(f"Caméra '{camera_obj.name}' configurée et active.")

    # --- 7. Configurer le rendu et sauvegarder ---
    print("Configuration du rendu...")
    scene.render.engine = 'BLENDER_EEVEE' # Ou 'CYCLES'
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.compression = 15 # Pour PNG, 0-100. 15 est un bon compromis.
    scene.render.filepath = output_path
    print(f"Chemin de sortie du rendu défini sur : {scene.render.filepath}")

    # Le dossier de sortie /app/output_renders/ est mappé par Docker.
    # Blender devrait pouvoir écrire dedans sans création explicite ici,
    # car le volume mappé /app/output_renders doit exister.
    # Si output_path_rel contenait des sous-dossiers, il faudrait créer :
    # output_dir_in_container = os.path.dirname(output_path)
    # if not os.path.exists(output_dir_in_container):
    # os.makedirs(output_dir_in_container, exist_ok=True)

    print("Lancement du rendu...")
    try:
        bpy.ops.render.render(write_still=True)
        print(f"Rendu terminé. L'image devrait être sauvegardée à : {output_path}")

        print("Attente de 2 secondes pour la synchronisation du système de fichiers...")
        time.sleep(2)

        if os.path.exists(output_path):
            print(f"SUCCÈS (après sleep) : Le fichier de sortie existe ! Taille : {os.path.getsize(output_path)} bytes.")
        else:
            print(f"ÉCHEC (après sleep) : Le fichier de sortie N'EXISTE PAS à {output_path} après le rendu et l'attente.")
            print("Vérifiez la console Blender pour des erreurs de rendu spécifiques non capturées.")
    except Exception as e:
        print(f"Erreur pendant bpy.ops.render.render : {e}")
        bpy.ops.wm.quit_blender()
        return

    print("Blender script finished.")
    # bpy.ops.wm.quit_blender() # Optionnel: quitter Blender explicitement

if __name__ == "__main__":
    main()