import CONTEXT from '../_CONTEXT'
import { createEvent } from '../_mockData'
import Context from '../context'

const context = new Context(CONTEXT)
const transform = context.map

test(`Accepted -> AcceptAction`, () => {
  let action = transform(createEvent('Accepted'));
  expect(action).toHaveProperty('type', 'AcceptAction')
});

test(`ExternalCreate -> AddAction`, () => {
  let action = transform(createEvent('ExternalCreate'));
  expect(action).toHaveProperty('type', 'AddAction')
});

test(`Created -> AddAction`, () => {
  let action = transform(createEvent('Created'));
  expect(action).toHaveProperty('type', 'AddAction')
});

test(`Assigned -> AssignAction`, () => {
  let action = transform(createEvent('Assigned'));
  expect(action).toHaveProperty('type', 'AssignAction')
});

test(`Associated -> AssignAction`, () => {
  let action = transform(createEvent('Associated'));
  expect(action).toHaveProperty('type', 'AssignAction')
});

test(`AutoAccepted -> AssignAction`, () => {
  let action = transform(createEvent('AutoAccepted'));
  expect(action).toHaveProperty('type', 'AssignAction')
});

test(`AssignedToSelf -> AssignAction`, () => {
  let action = transform(createEvent('AssignedToSelf'));
  expect(action).toHaveProperty('type', 'AssignAction')
});

test(`Deleted -> RemoveAction`, () => {
  let action = transform(createEvent('Deleted'));
  expect(action).toHaveProperty('type', 'RemoveAction')
});

test(`Registered -> RegisterAction`, () => {
  let action = transform(createEvent('Registered'));
  expect(action).toHaveProperty('type', 'RegisterAction')
});

test(`Declined -> RejectAction`, () => {
  let action = transform(createEvent('Declined'));
  expect(action).toHaveProperty('type', 'RejectAction')
});

test(`LeadActivity -> UpdateAction`, () => {
  let action = transform(createEvent('LeadActivity'));
  expect(action).toHaveProperty('type', 'UpdateAction')
});

test(`DuplicateCreated -> UpdateAction`, () => {
  let action = transform(createEvent('DuplicateCreated'));
  expect(action).toHaveProperty('type', 'UpdateAction')
});

test(`AdminUpdate -> UpdateAction`, () => {
  let action = transform(createEvent('AdminUpdate'));
  expect(action).toHaveProperty('type', 'UpdateAction')
});

test(`CRMSync -> UpdateAction`, () => {
  let action = transform(createEvent('CRMSync'));
  expect(action).toHaveProperty('type', 'UpdateAction')
});

test(`NoteAdded -> UpdateAction`, () => {
  let action = transform(createEvent('NoteAdded'));
  expect(action).toHaveProperty('type', 'UpdateAction')
});

test(`Updated -> UpdateAction`, () => {
  let action = transform(createEvent('Updated'));
  expect(action).toHaveProperty('type', 'UpdateAction')
});

test(`Retracted -> UnAssignAction`, () => {
  let action = transform(createEvent('Retracted'));
  expect(action).toHaveProperty('type', 'UnAssignAction')
});

test(`Unassigned -> UnAssignAction`, () => {
  let action = transform(createEvent('Unassigned'));
  expect(action).toHaveProperty('type', 'UnAssignAction')
});
