function RecipeNotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-4xl font-bold mb-4">🍳 Recipe Not Found</h1>
            <p className="text-gray-500 mb-6">
                The recipe you are looking for does not exist or was removed.
            </p>

            <button
                onClick={() => window.location.href = "/generate"}
                className="px-6 py-3 bg-black text-white rounded-xl"
            >
                Generate New Recipe
            </button>
        </div>
    );
}