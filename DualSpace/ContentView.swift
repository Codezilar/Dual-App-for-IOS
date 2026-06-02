import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: ProfileStore
    @State private var showingEditor = false

    var body: some View {
        NavigationStack {
            Group {
                if store.profiles.isEmpty {
                    emptyState
                } else {
                    List {
                        Section {
                            ForEach(store.profiles) { profile in
                                NavigationLink(value: profile) {
                                    ProfileRow(profile: profile)
                                }
                                .swipeActions(edge: .trailing) {
                                    Button(role: .destructive) {
                                        if let index = store.profiles.firstIndex(of: profile) {
                                            store.delete(at: IndexSet(integer: index))
                                        }
                                    } label: {
                                        Label("Delete", systemImage: "trash")
                                    }

                                    Button {
                                        store.clearData(for: profile)
                                    } label: {
                                        Label("Clear", systemImage: "eraser")
                                    }
                                    .tint(.orange)
                                }
                            }
                            .onDelete(perform: store.delete)
                        } header: {
                            Text("Profiles")
                        }
                    }
                }
            }
            .navigationTitle("Dual Space")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showingEditor = true
                    } label: {
                        Label("New Clone", systemImage: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingEditor) {
                ProfileEditorView()
            }
            .navigationDestination(for: AppProfile.self) { profile in
                BrowserView(profile: profile)
            }
        }
    }

    private var emptyState: some View {
        ContentUnavailableView {
            Label("No Clones Yet", systemImage: "square.on.square")
        } description: {
            Text("Create a profile for each separate web-app session.")
        } actions: {
            Button("Create Clone") {
                showingEditor = true
            }
            .buttonStyle(.borderedProminent)
        }
    }
}

private struct ProfileRow: View {
    let profile: AppProfile

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 8, style: .continuous)
                    .fill(profile.colorName.color.gradient)
                Image(systemName: "square.on.square")
                    .foregroundStyle(.white)
                    .font(.title3)
            }
            .frame(width: 44, height: 44)

            VStack(alignment: .leading, spacing: 4) {
                Text(profile.name)
                    .font(.headline)
                    .lineLimit(1)
                Text(profile.urlString)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }
        }
        .padding(.vertical, 4)
    }
}

#Preview {
    ContentView()
        .environmentObject(ProfileStore())
}
