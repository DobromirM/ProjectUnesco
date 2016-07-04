using UnityEngine;
using UnityEditor;
using System;
using System.Collections.Generic;

// Doubles and flips imported geometry

public class DoubleSidedModelImporter : AssetPostprocessor {
	
	protected const string kFolderName = "double-sided";
	
	protected void OnPostprocessModel(GameObject modelPrefab) {
		
		// Only double geometry on models in appropriately named folders
		if (!assetPath.ToLower().Contains(kFolderName)) {
			return;
		}
		
		// Collect all meshes, both static and skinned
		var allMeshes = new HashSet<Mesh>();
		var meshFilters = new List<MeshFilter>(
			modelPrefab.GetComponentsInChildren<MeshFilter>()
			);
		foreach (var filter in meshFilters) {
			if (!allMeshes.Contains(filter.sharedMesh)) {
				allMeshes.Add(filter.sharedMesh);
			}
		}
		var skinnedMeshRenderers = new List<SkinnedMeshRenderer>(
			modelPrefab.GetComponentsInChildren<SkinnedMeshRenderer>()
			);
		foreach (var skinnedRenderers in skinnedMeshRenderers) {
			if (!allMeshes.Contains(skinnedRenderers.sharedMesh)) {
				allMeshes.Add(skinnedRenderers.sharedMesh);
			}
		}
		foreach (var mesh in allMeshes) {
			
			// Invert normals on duplicated geometry
			var oldVertexCount = mesh.vertexCount;
			var newVertices = DoubleArray(mesh.vertices);
			var newNormals = DoubleArray(mesh.normals);
			for (var i = newNormals.Length/2; i < newNormals.Length; ++i) {
				newNormals[i] = -newNormals[i];
			}
			
			// Invert tangent W components to account for mirrored UVs
			var newTangents = DoubleArray(mesh.tangents);
			for (var i = newTangents.Length/2; i < newTangents.Length; ++i) {
				newTangents[i].w = -newTangents[i].w;
			}
			
			// All other attributes remain the same
			var newColors = DoubleArray(mesh.colors);
			var newUVs = DoubleArray(mesh.uv);
			var newUV2s = DoubleArray(mesh.uv2);
			var newBoneWeights = DoubleArray(mesh.boneWeights);
			
			// Reverse winding on doubled triangles so front face matches normal
			// Also point doubled triangles at doubled vertex indices
			var triangleLists = new List<int[]>();
			for (var submeshIndex = 0; submeshIndex < mesh.subMeshCount; ++submeshIndex) {
				var oldTriangles = mesh.GetTriangles(submeshIndex);
				var newTriangles = DoubleArray(oldTriangles);
				for (var i = oldTriangles.Length/3; i < oldTriangles.Length/3*2; ++i) {
					
					newTriangles[i*3] += oldVertexCount;
					
					var temp = newTriangles[i*3+1] + oldVertexCount;
					newTriangles[i*3+1] = newTriangles[i*3+2] + oldVertexCount;
					newTriangles[i*3+2] = temp;
				}
				triangleLists.Add(newTriangles);
			}
			
			// Assign all vertex attributes
			mesh.vertices = newVertices;
			mesh.normals = newNormals;
			mesh.tangents = newTangents;
			mesh.colors = newColors;
			mesh.uv = newUVs;
			mesh.uv2 = newUV2s;
			mesh.boneWeights = newBoneWeights;
			
			// Assign triangles last, so they match vertices
			for (var submeshIndex = 0; submeshIndex < mesh.subMeshCount; ++submeshIndex) {
				mesh.SetTriangles(triangleLists[submeshIndex], submeshIndex);
			}
		}
	}
	
	// Returns the input array concatenated with itself
	protected static T[] DoubleArray<T>(T[] input) {
		var newArray = new T[input.Length*2];
		Array.Copy(
			input,
			0,
			newArray,
			0,
			input.Length
			);
		Array.Copy(
			input,
			0,
			newArray,
			input.Length,
			input.Length
			);
		return newArray;
	}
	
}