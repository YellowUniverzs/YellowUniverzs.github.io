const fuse = new Fuse(data, {
  keys: ['title'],
  threshold: 0.4
});

const result = fuse.search(query);

