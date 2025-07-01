import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function ReceivingItemRow({
  index,
  item,
  onChange,
  onRemove,
  fieldPrefix = '',
  disableRemove = false
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['qty', 'unit_price'].some((k) => name.includes(k))
      ? parseFloat(value) || 0
      : value;
    onChange(index, name, parsedValue);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/10 shadow-sm">
      {/* Product ID */}
      <div>
        <Label className="text-white/80 text-xs mb-1 block">Product ID</Label>
        <Input
          placeholder="Product ID"
          name={`${fieldPrefix}prd_id`}
          value={item[`${fieldPrefix}prd_id`] || ''}
          onChange={handleChange}
          className="bg-black/20 text-white"
          required
        />
      </div>

      {/* Quantity */}
      <div>
        <Label className="text-white/80 text-xs mb-1 block">Quantity</Label>
        <Input
          placeholder="Quantity"
          name={`${fieldPrefix}qty`}
          value={item[`${fieldPrefix}qty`] || ''}
          onChange={handleChange}
          type="number"
          min={1}
          className="bg-black/20 text-white"
          required
        />
      </div>

      {/* Unit Price */}
      <div>
        <Label className="text-white/80 text-xs mb-1 block">Unit Price</Label>
        <Input
          placeholder="Unit Price"
          name={`${fieldPrefix}unit_price`}
          value={item[`${fieldPrefix}unit_price`] || ''}
          onChange={handleChange}
          type="number"
          min={0}
          step="0.01"
          className="bg-black/20 text-white"
        />
      </div>

      {/* Expiry Date */}
      <div>
        <Label className="text-white/80 text-xs mb-1 block">Expiry Date</Label>
        <Input
          placeholder="Expiry Date"
          name={`${fieldPrefix}expiry_date`}
          value={item[`${fieldPrefix}expiry_date`] || ''}
          onChange={handleChange}
          type="date"
          className="bg-black/20 text-white"
        />
      </div>

      {/* Remove Button */}
      {!disableRemove && (
        <div className="flex items-end">
          <Button
            type="button"
            onClick={() => onRemove(index)}
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
