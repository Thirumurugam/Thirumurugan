import { Router } from 'express';
import { readDb } from '../db.js';

const router = Router();

// Format room with senior & ICU metadata
const enrichRoom = (r) => ({
  ...r,
  isICU: Boolean(r.isICU || (r.name && r.name.toLowerCase().includes('icu')) || (r.room && r.room.includes('404'))),
  isSeniorFriendly: true,
  roomNumber: r.room ? r.room.replace('Room ', '') : ''
});

// GET /api/rooms - Get all rooms or filter by floor
router.get('/', (req, res) => {
  const db = readDb();
  const floor = req.query.floor;
  const rawRooms = db.rooms || {};

  const enriched = {};
  for (const f of Object.keys(rawRooms)) {
    enriched[f] = (rawRooms[f] || []).map(enrichRoom);
  }

  if (floor && enriched[floor]) {
    return res.json({
      success: true,
      floor,
      count: enriched[floor].length,
      data: enriched[floor]
    });
  }

  res.json({
    success: true,
    data: enriched
  });
});

// GET /api/rooms/:roomNo - Get details of a single room
router.get('/:roomNo', (req, res) => {
  const db = readDb();
  const searchNo = req.params.roomNo.toLowerCase();
  const rooms = db.rooms || {};

  for (const floorKey of Object.keys(rooms)) {
    const found = rooms[floorKey].find(r => 
      r.room.toLowerCase() === searchNo || 
      r.room.toLowerCase().includes(searchNo)
    );
    if (found) {
      return res.json({
        success: true,
        floorKey,
        data: found
      });
    }
  }

  res.status(404).json({
    success: false,
    error: `Room ${req.params.roomNo} not found`
  });
});

export default router;
