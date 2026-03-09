const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Weapon = require('../models/Weapon');

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
  await Weapon.deleteMany({});
});

// ─── CASOS POSITIVOS ───────────────────────────────────────────────────────────

test('P1: Crear un arma válida con todos los campos', async () => {
  const weapon = new Weapon({
    name: 'Andúril',
    description: 'La llama del Oeste, reforjada para Aragorn',
    type: 'Espada',
    damage: 95,
    isMagical: true,
  });

  const saved = await weapon.save();

  expect(saved._id).toBeDefined();
  expect(saved.name).toBe('Andúril');
  expect(saved.type).toBe('Espada');
  expect(saved.damage).toBe(95);
  expect(saved.isMagical).toBe(true);
});

test('P2: Crear un arma con valores por defecto aplicados', async () => {
  const weapon = new Weapon({
    name: 'Hacha Enana',
    type: 'Hacha',
  });

  const saved = await weapon.save();

  expect(saved.description).toBe('Arma legendaria de la Tierra Media');
  expect(saved.damage).toBe(10);
  expect(saved.isMagical).toBe(false);
});

test('P3: Guardar arma con referencia a un propietario (owner)', async () => {
  const fakeOwnerId = new mongoose.Types.ObjectId();

  const weapon = new Weapon({
    name: 'Glamdring',
    type: 'Espada',
    damage: 88,
    isMagical: true,
    owner: fakeOwnerId,
  });

  const saved = await weapon.save();

  expect(saved.owner.toString()).toBe(fakeOwnerId.toString());
});

// ─── CASOS NEGATIVOS ───────────────────────────────────────────────────────────

test('N1: Error de validación cuando falta el campo "name" (requerido)', async () => {
  const weapon = new Weapon({
    type: 'Daga',
    damage: 30,
  });

  await expect(weapon.save()).rejects.toThrow(mongoose.Error.ValidationError);

  try {
    await weapon.save();
  } catch (err) {
    expect(err.errors.name).toBeDefined();
    expect(err.errors.name.message).toBe('El nombre del arma es obligatorio');
  }
});

test('N2: Error de validación cuando "type" no es un valor del enum', async () => {
  const weapon = new Weapon({
    name: 'Látigo de Fuego',
    type: 'Látigo',
    damage: 80,
  });

  await expect(weapon.save()).rejects.toThrow(mongoose.Error.ValidationError);

  try {
    await weapon.save();
  } catch (err) {
    expect(err.errors.type).toBeDefined();
    expect(err.errors.type.message).toContain('Látigo no es un tipo de arma válido');
  }
});
