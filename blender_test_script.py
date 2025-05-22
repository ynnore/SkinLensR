# blender_script.py
import bpy
import sys
import argparse
import os

print("--- Blender Script Started ---")

def get_argv_after_doubledash(argv_list=None):
    if argv_list is None:
        argv_list = sys.argv
    try:
        idx = argv_list.index("--")
        return argv_list[idx+1:]
    except ValueError:
        print("ERREUR: Le séparateur '--' est manquant dans les arguments de la commande.")
        sys.exit(1) # Quitter si les arguments ne peuvent pas être lus

args_from_command_line = get_argv_after_doubledash()

parser = argparse.ArgumentParser(description="Blender script for rendering with a specific input texture.")
parser.add_argument(
    '--blend_file_path', # Chemin DANS LE CONTENEUR vers votre fichier .blend
    type=str,
    default="base_scene.blend", # Ex: "base_scene.blend" si à la racine de /app
    help="Path to the .blend file to open (relative to /app, e.g., models/scene.blend)"
)
parser.add_argument(
    '--input_image_path', # Chemin DANS LE CONTENEUR vers l'image uploadée
    type=str,
    required=True,
    help="Path to the input image (relative to /app, e.g., input_texture/my_image.jpeg)"
)
parser.add_argument(
    '--output_path', # Chemin DANS LE CONTENEUR pour sauvegarder le rendu
    type=str,
    default="output/default_render_output.png",
    help="Path to save the rendered image (relative to /app, e.g., output/render_output.png)"
)
parser.add_argument(
    '--target_object_name',
    type=str,
    default="SkinModelObject", # Nom de l'objet dans votre .blend qui reçoit la texture
    help="Name of the object in the .blend file to apply the texture to."
)
parser.add_argument(
    '--material_slot_index',
    type=int,
    default=0, # Index du slot de matériau sur l'objet cible
    help="Index of the material slot on the target object."
)
parser.add_argument(
    '--image_texture_node_name',
    type=str,
    default="InputImageTexture", # Nom suggéré pour le nœud Image Texture
    help="Name for the Image Texture node (will be created or found)."
)
parser.add_argument(
    '--shader_node_name',
    type=str,
    default="Principled BSDF", # Nom du nœud shader principal (ex: Principled BSDF)
    help="Name of the main shader node to connect the texture to (e.g., Principled BSDF)."
)
parser.add_argument(
    '--shader_input_socket_name',
    type=str,
    default="Base Color", # Nom du socket d'entrée sur le shader (ex: Base Color)
    help="Name of the input socket on the shader node (e.g., 'Base Color', 'Emission')."
)


parsed_args, unknown_args = parser.parse_known_args(args_from_command_line)

print(f"Python version: {sys.version}")
print(f"Blender version: {bpy.app.version_string}")
print(f"Arguments reçus (après '--'): {args_from_command_line}")
print(f"Arguments parsés: {parsed_args}")
if unknown_args:
    print(f"Arguments inconnus ignorés: {unknown_args}")

# --- Construire les chemins absolus à l'intérieur du conteneur (WORKDIR est /app) ---
def make_abs_path(rel_path):
    if os.path.isabs(rel_path):
        return rel_path
    return os.path.join("/app", rel_path)

blender_blend_filepath_abs = make_abs_path(parsed_args.blend_file_path)
blender_input_filepath_abs = make_abs_path(parsed_args.input_image_path)
blender_output_filepath_abs = make_abs_path(parsed_args.output_path)

print(f"Chemin du fichier .blend (absolu dans conteneur): {blender_blend_filepath_abs}")
print(f"Chemin d'image d'entrée (absolu dans conteneur): {blender_input_filepath_abs}")
print(f"Chemin de sortie (absolu dans conteneur): {blender_output_filepath_abs}")

# --- Vérifications des fichiers et dossiers ---
if not os.path.exists(blender_blend_filepath_abs):
    print(f"ERREUR: Le fichier .blend n'a pas été trouvé à: {blender_blend_filepath_abs}")
    sys.exit(1)

if not os.path.exists(blender_input_filepath_abs):
    print(f"ERREUR: L'image d'entrée n'a pas été trouvée à: {blender_input_filepath_abs}")
    sys.exit(1)

output_directory = os.path.dirname(blender_output_filepath_abs)
if output_directory:
    if not os.path.exists(output_directory):
        print(f"Création du dossier de sortie: {output_directory}")
        os.makedirs(output_directory, exist_ok=True)
    else:
        print(f"Dossier de sortie existe déjà: {output_directory}")

# --- Logique Blender Spécifique ---
try:
    print(f"Chargement du fichier .blend: {blender_blend_filepath_abs}")
    bpy.ops.wm.open_mainfile(filepath=blender_blend_filepath_abs)

    # Récupérer l'objet cible
    target_object = bpy.data.objects.get(parsed_args.target_object_name)
    if not target_object:
        print(f"ERREUR: Objet cible '{parsed_args.target_object_name}' non trouvé dans la scène.")
        sys.exit(1)
    print(f"Objet cible trouvé: {target_object.name}")

    # Récupérer le matériau
    if not target_object.material_slots or parsed_args.material_slot_index >= len(target_object.material_slots):
        print(f"ERREUR: Slot de matériau invalide (index {parsed_args.material_slot_index}) pour l'objet '{target_object.name}'.")
        sys.exit(1)
    
    material = target_object.material_slots[parsed_args.material_slot_index].material
    if not material:
        print(f"ERREUR: Aucun matériau dans le slot {parsed_args.material_slot_index} de l'objet '{target_object.name}'.")
        sys.exit(1)
    print(f"Matériau trouvé: {material.name}")

    # S'assurer que le matériau utilise des nœuds
    if not material.use_nodes:
        material.use_nodes = True
        print(f"Activation de use_nodes pour le matériau {material.name}")
    
    nodes = material.node_tree.nodes
    links = material.node_tree.links

    # Charger l'image d'entrée
    print(f"Chargement de l'image d'entrée: {blender_input_filepath_abs}")
    input_image = bpy.data.images.load(blender_input_filepath_abs)
    if not input_image:
        print(f"ERREUR: Impossible de charger l'image d'entrée: {blender_input_filepath_abs}")
        sys.exit(1)
    print(f"Image '{input_image.name}' chargée avec succès, dimensions: {input_image.size[0]}x{input_image.size[1]}")

    # Trouver ou créer le nœud Image Texture
    image_texture_node = nodes.get(parsed_args.image_texture_node_name)
    if not image_texture_node:
        print(f"Nœud Image Texture '{parsed_args.image_texture_node_name}' non trouvé, création...")
        image_texture_node = nodes.new(type='ShaderNodeTexImage')
        image_texture_node.name = parsed_args.image_texture_node_name
        image_texture_node.label = parsed_args.image_texture_node_name
        # Positionner le nœud pour la lisibilité (facultatif)
        # Vous devrez peut-être ajuster ces coordonnées ou les rendre dynamiques
        shader_node_for_pos = nodes.get(parsed_args.shader_node_name)
        if shader_node_for_pos:
            image_texture_node.location = shader_node_for_pos.location
            image_texture_node.location.x -= 300 # Décaler à gauche du shader principal
        else:
             image_texture_node.location = (0,0)
    else:
        print(f"Nœud Image Texture '{image_texture_node.name}' trouvé.")

    image_texture_node.image = input_image
    print(f"Image assignée au nœud '{image_texture_node.name}'.")

    # Trouver le nœud shader principal (ex: Principled BSDF)
    shader_node = nodes.get(parsed_args.shader_node_name)
    if not shader_node:
        # Essayer de trouver par type si le nom n'est pas trouvé (plus robuste)
        # Par exemple, pour le Principled BSDF :
        for node_in_tree in nodes:
            if node_in_tree.type == 'BSDF_PRINCIPLED':
                shader_node = node_in_tree
                print(f"Nœud shader principal trouvé par type ({shader_node.type}): {shader_node.name}")
                break
        if not shader_node:
            print(f"ERREUR: Nœud shader principal '{parsed_args.shader_node_name}' (ou de type compatible) non trouvé.")
            sys.exit(1)
    else:
        print(f"Nœud shader principal trouvé par nom: {shader_node.name}")


    # Connecter le nœud Image Texture au socket d'entrée du shader principal
    shader_input_socket = shader_node.inputs.get(parsed_args.shader_input_socket_name)
    if not shader_input_socket:
        print(f"ERREUR: Socket d'entrée '{parsed_args.shader_input_socket_name}' non trouvé sur le nœud shader '{shader_node.name}'. Vérifiez les noms de sockets disponibles.")
        print("Sockets disponibles sur le shader:")
        for s in shader_node.inputs: print(f"  - {s.name} (type: {s.type})")
        sys.exit(1)
    
    print(f"Connexion de {image_texture_node.name}.Color -> {shader_node.name}.{shader_input_socket.name}")
    links.new(image_texture_node.outputs['Color'], shader_input_socket)

    # Configurer le moteur de rendu (optionnel, mais bon pour la consistance)
    # bpy.context.scene.render.engine = 'CYCLES' # ou 'BLENDER_EEVEE'
    # if bpy.context.scene.render.engine == 'CYCLES':
    #     bpy.context.scene.cycles.device = 'CPU' # Ou 'GPU' si configuré dans Docker
        # bpy.context.scene.cycles.samples = 128 # Ajuster le nombre de samples

    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.context.scene.render.filepath = blender_output_filepath_abs

    print(f"Rendu en cours vers {blender_output_filepath_abs}...")
    bpy.ops.render.render(write_still=True)
    print(f"Image sauvegardée avec succès: {blender_output_filepath_abs}")

except Exception as e:
    print(f"ERREUR INATTENDUE pendant le traitement Blender: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("--- Blender Script Finished Successfully ---")
sys.exit(0)