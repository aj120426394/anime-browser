# GraphQL Setup & Codegen Guide

## ✅ Current Setup: `.graphql` Files + GraphQL Code Generator

### Why `.graphql` Files?

You were absolutely right to suggest this! Using `.graphql` files is the **GraphQL best practice**:

1. **Single Source of Truth** - Queries live in `.graphql` files, not scattered in TypeScript
2. **Schema Validation** - Codegen validates queries against the AniList schema automatically
3. **Type Safety** - Auto-generated TypeScript hooks with full type inference
4. **Maintainability** - Easier to track what queries you have and update them
5. **IDE Support** - GraphQL extensions can validate and autocomplete in `.graphql` files
6. **Separation of Concerns** - Queries (`.graphql`) separate from logic (`.ts`)

### Current Structure

```
lib/graphql/
├── queries/
│   └── anime.graphql          ← GraphQL queries (source of truth)
├── generated/
│   ├── schema.ts              ← Auto-generated AniList schema types
│   └── operations.ts          ← Auto-generated hooks (useGetAnimePageQuery, etc.)
├── client.ts                  ← Apollo Client configuration
└── codegen.yml                ← Codegen configuration
```

### How It Works

1. **Write Query** → `lib/graphql/anime.graphql`
   ```graphql
   query GetAnimePage($page: Int!, $perPage: Int!) {
     Page(page: $page, perPage: $perPage) {
       # ...
     }
   }
   ```

2. **Run Codegen** → `npm run codegen`
   - Connects to AniList GraphQL schema
   - Generates `lib/graphql/generated/operations.ts` with:
     - `GetAnimePageQuery` type
     - `GetAnimePageQueryVariables` type
     - `useGetAnimePageQuery()` hook
     - `useGetAnimePageLazyQuery()` lazy hook

3. **Use in Components**
   ```typescript
   import { useGetAnimePageQuery } from "@/lib/graphql/generated/operations";
   
   export function useMediaPage(page: number, perPage: number = 20) {
     const { data, loading, error } = useGetAnimePageQuery({
       variables: { page, perPage }
     });
     // ... transform and return
   }
   ```

### Generated Files

**`lib/graphql/generated/operations.ts`** (manually created for now, can be regenerated):
- `GetAnimePageQuery` - Full typed response
- `GetAnimePageQueryVariables` - Typed variables
- `GetAnimePageDocument` - gql document
- `useGetAnimePageQuery()` - React hook
- `useGetAnimePageLazyQuery()` - Lazy hook

### Adding More Queries

When you need more queries:

1. Create `lib/graphql/queries/anime.graphql` (or `manga.graphql`, etc.)
   ```graphql
   query GetMangaPage($page: Int!, $perPage: Int!) {
     # ...
   }
   ```

2. Run `npm run codegen`
   - Updates `lib/graphql/generated/operations.ts` with new types & hooks

3. Use in your hooks
   ```typescript
   import { useGetMangaPageQuery } from "@/lib/graphql/generated/operations";
   ```

### Configuration

**`codegen.yml`**:
```yaml
schema: https://graphql.anilist.co      # AniList GraphQL endpoint
documents: "lib/graphql/**/*.graphql"   # Read queries from .graphql files

generates:
  lib/graphql/generated/schema.ts:      # Full schema types
    plugins: [typescript]
  
  lib/graphql/generated/operations.ts:  # Query-specific types & hooks
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
```

### When to Regenerate

Run `npm run codegen` when:
- ✅ Adding a new `.graphql` file with queries
- ✅ Updating existing queries in `.graphql` files
- ✅ AniList schema changes (rare)
- ✅ After pulling latest from git

### Development Workflow

```bash
# Development
npm run dev                    # Start app with auto-reload

# Add/update queries
1. Edit lib/graphql/anime.graphql
2. npm run codegen            # Generate new types
3. Update components to use new hooks
4. npm run test              # Test changes

# Before commit
npm run type-check            # Verify TypeScript
npm run lint                  # ESLint
npm run test                  # Tests pass
git commit -m "..."
```

### Benefits of This Setup

✅ **Type Safety**: Full TypeScript inference from GraphQL schema  
✅ **Auto-Complete**: IDEs can autocomplete queries and results  
✅ **Validation**: Codegen validates queries before generation  
✅ **Scalability**: Easy to add 10+ queries without clutter  
✅ **Maintenance**: Single source of truth for query definitions  
✅ **Best Practice**: Matches industry standard GraphQL workflows  
✅ **Developer Experience**: Clean separation of concerns  

---

## Next Steps

When Phase 3 begins (Profile Gate implementation):
1. You might add more `.graphql` files as needed
2. Run `npm run codegen` to update generated types
3. Use the generated hooks in your components
4. All with full TypeScript safety! 🎉

Enjoy the better GraphQL workflow! 🚀
