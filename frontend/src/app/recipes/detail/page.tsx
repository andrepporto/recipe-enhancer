import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Recipe = {
    id: string;
    title: string;
    description?: string;
    ingredients: string[];
    steps: string[];
    tags?: string[];
    [key: string]: unknown;
};

export default function Page({
    params,
    searchParams,
}: {
    params?: { id?: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const router = useRouter();
    const id =
        params?.id ||
        (typeof searchParams?.id === "string" ? searchParams.id : undefined) ||
        (typeof window !== "undefined"
            ? window.location.pathname.split("/").filter(Boolean).pop()
            : undefined);

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState<boolean>(!!id);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("No recipe id provided.");
            setLoading(false);
            return;
        }

        let mounted = true;
        setLoading(true);
        fetch(`/api/recipes/${encodeURIComponent(id)}`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || res.statusText);
                }
                return res.json();
            })
            .then((data: Recipe) => {
                if (!mounted) return;
                // normalize arrays
                data.ingredients = data.ingredients || [];
                data.steps = data.steps || [];
                data.tags = data.tags || [];
                setRecipe(data);
                setError(null);
            })
            .catch((err: Error) => {
                if (!mounted) return;
                const message = err instanceof Error ? err.message : String(err);
                setError(message || "Failed to load recipe.");
                setRecipe(null);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [id]);

    const updateField = <K extends keyof Recipe>(key: K, value: Recipe[K]) => {
        setRecipe((r) => {
            if (!r) return r;
            return { ...r, [key]: value } as Recipe;
        });
    };

    const updateArrayItem = (key: "ingredients" | "steps" | "tags", idx: number, value: string) => {
        setRecipe((r) => {
            if (!r) return r;
            const arr = [...(r[key] || [])];
            arr[idx] = value;
            return { ...r, [key]: arr };
        });
    };

    const addArrayItem = (key: "ingredients" | "steps" | "tags") => {
        setRecipe((r) => {
            if (!r) return r;
            const arr = [...(r[key] || []), ""];
            return { ...r, [key]: arr };
        });
    };

    const removeArrayItem = (key: "ingredients" | "steps" | "tags", idx: number) => {
        setRecipe((r) => {
            if (!r) return r;
            const arr = [...(r[key] || [])];
            arr.splice(idx, 1);
            return { ...r, [key]: arr };
        });
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!recipe || !id) return;
        setSaving(true);
        setError(null);
        setSuccess(null);

        // basic validation
        if (!recipe.title || recipe.title.trim() === "") {
            setError("Title is required.");
            setSaving(false);
            return;
        }

        try {
            const res = await fetch(`/api/recipes/${encodeURIComponent(id)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(recipe),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || res.statusText);
            }
            const data = await res.json();
            setRecipe(data);
            setSuccess("Saved.");
            // optionally navigate back or refresh
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || "Failed to save.");
        } finally {
            setSaving(false);
            // clear status after a bit
            setTimeout(() => setSuccess(null), 2500);
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm("Delete this recipe? This cannot be undone.")) return;
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/recipes/${encodeURIComponent(id)}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || res.statusText);
            }
            router.push("/recipes");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || "Failed to delete.");
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading recipe...</div>;
    }

    if (!recipe) {
        return <div>No recipe found.</div>;
    }

    if (error && !recipe) {
        return (
            <div>
                <p style={{ color: "red" }}>{error}</p>
                <button onClick={() => router.back()}>Back</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
            <h1>Edit Recipe</h1>
            <form onSubmit={handleSave}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Title
                        <input
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                            value={recipe.title || ""}
                            onChange={(e) => updateField("title", e.target.value)}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Description
                        <textarea
                            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                            value={recipe.description || ""}
                            onChange={(e) => updateField("description", e.target.value)}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Ingredients</label>
                    {(recipe.ingredients || []).map((ing, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            <input
                                style={{ flex: 1, padding: 8 }}
                                value={ing}
                                onChange={(e) => updateArrayItem("ingredients", i, e.target.value)}
                            />
                            <button type="button" onClick={() => removeArrayItem("ingredients", i)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem("ingredients")} style={{ marginTop: 8 }}>
                        Add ingredient
                    </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Steps</label>
                    {(recipe.steps || []).map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            <textarea
                                style={{ flex: 1, padding: 8 }}
                                value={step}
                                onChange={(e) => updateArrayItem("steps", i, e.target.value)}
                            />
                            <button type="button" onClick={() => removeArrayItem("steps", i)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem("steps")} style={{ marginTop: 8 }}>
                        Add step
                    </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Tags (comma separated)</label>
                    <input
                        style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
                        value={(recipe.tags || []).join(", ")}
                        onChange={(e) =>
                            updateField(
                                "tags",
                                e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                            )
                        }
                    />
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            router.back();
                        }}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button type="button" onClick={handleDelete} style={{ marginLeft: "auto", color: "red" }} disabled={saving}>
                        Delete
                    </button>
                </div>

                {error && (
                    <div style={{ marginTop: 12, color: "red" }}>
                        <small>{error}</small>
                    </div>
                )}
                {success && (
                    <div style={{ marginTop: 12, color: "green" }}>
                        <small>{success}</small>
                    </div>
                )}
            </form>
        </div>
    );
}