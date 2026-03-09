const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Character = require('../models/Character');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Character.deleteMany({});
});

// ─── CASOS POSITIVOS ───────────────────────────────────────────────────────────

test('P1: Crear un personaje válido con todos los campos', async () => {
  const character = new Character({
    name: 'Aragorn',
    title: 'Rey de Gondor',
    race: 'Humano',
    age: 87,
    powerLevel: 90,
    isAlive: true,
    hasRing: false,
  });

  const saved = await character.save();

  expect(saved._id).toBeDefined();
  expect(saved.name).toBe('Aragorn');
  expect(saved.race).toBe('Humano');
  expect(saved.age).toBe(87);
  expect(saved.powerLevel).toBe(90);
});

test('P2: Crear un personaje con valores por defecto aplicados', async () => {
  const character = new Character({
    name: 'Legolas',
    race: 'Elfo',
    age: 2931,
  });

  const saved = await character.save();

  expect(saved.title).toBe('Sin título');
  expect(saved.powerLevel).toBe(50);
  expect(saved.isAlive).toBe(true);
  expect(saved.hasRing).toBe(false);
  expect(saved.weapons).toEqual([]);
});

test('P3: Guardar personaje y recuperarlo de la base de datos por ID', async () => {
  const character = new Character({
    name: 'Gandalf',
    title: 'El Gris',
    race: 'Maia',
    age: 2019,
    powerLevel: 99,
  });

  const saved = await character.save();
  const found = await Character.findById(saved._id);

  expect(found).not.toBeNull();
  expect(found.name).toBe('Gandalf');
  expect(found.title).toBe('El Gris');
  expect(found.powerLevel).toBe(99);
});

// ─── CASOS NEGATIVOS ───────────────────────────────────────────────────────────

test('N1: Error de validación cuando falta el campo "name" (requerido)', async () => {
  const character = new Character({
    race: 'Hobbit',
    age: 50,
  });

  await expect(character.save()).rejects.toThrow(mongoose.Error.ValidationError);

  try {
    await character.save();
  } catch (err) {
    expect(err.errors.name).toBeDefined();
    expect(err.errors.name.message).toBe('El nombre del personaje es obligatorio');
  }
});

test('N2: Error de validación cuando "race" no es un valor del enum', async () => {
  const character = new Character({
    name: 'Sméagol',
    race: 'Gólem',
    age: 589,
  });

  await expect(character.save()).rejects.toThrow(mongoose.Error.ValidationError);

  try {
    await character.save();
  } catch (err) {
    expect(err.errors.race).toBeDefined();
    expect(err.errors.race.message).toContain('Gólem no es una raza válida');
  }
});

test('N3: Error de validación cuando "age" supera el máximo permitido (10000)', async () => {
  const character = new Character({
    name: 'Ser Antiguo',
    race: 'Ent',
    age: 99999,
  });

  await expect(character.save()).rejects.toThrow(mongoose.Error.ValidationError);

  try {
    await character.save();
  } catch (err) {
    expect(err.errors.age).toBeDefined();
    expect(err.errors.age.message).toBe('La edad no puede exceder 10000 años');
  }
});
