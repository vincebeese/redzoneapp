export default function DealList({ deals, selectedId, onSelect }) {
  const activeDeals = deals.filter((d) => d.status === 'active');
  const otherDeals = deals.filter((d) => d.status !== 'active');

  const zones = ['red', 'green', 'yellow'];

  return (
    <div className="p-4 space-y-6">
      {/* Active deals by zone */}
      {zones.map((zone) => {
        const zoneDeals = activeDeals.filter((d) => d.zone === zone);
        if (zoneDeals.length === 0) return null;

        return (
          <div key={zone}>
            <h3 className="flex items-center text-sm font-semibold text-gray-500 mb-2">
              <ZoneIcon zone={zone} />
              <span className="ml-2 uppercase">{zone} Zone</span>
              <span className="ml-2 text-gray-400">({zoneDeals.length})</span>
            </h3>
            <div className="space-y-2">
              {zoneDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  isSelected={deal.id === selectedId}
                  onClick={() => onSelect(deal.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Closed/Archived deals */}
      {otherDeals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">
            Closed/Archived ({otherDeals.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {otherDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isSelected={deal.id === selectedId}
                onClick={() => onSelect(deal.id)}
              />
            ))}
          </div>
        </div>
      )}

      {deals.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          No deals yet. Create your first deal to get started.
        </p>
      )}
    </div>
  );
}

function DealCard({ deal, isSelected, onClick }) {
  const artifactCount = Number(deal.artifact_count) || 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-rzs-red text-white'
          : 'bg-white hover:bg-gray-100 border border-gray-200'
      }`}
    >
      <p className={`font-medium truncate ${isSelected ? 'text-white' : 'text-rzs-charcoal'}`}>
        {deal.company || deal.name}
      </p>
      <p className={`text-sm truncate ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>
        {deal.name}
      </p>
      {deal.deal_value && (
        <p className={`text-xs mt-1 ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
          ${Number(deal.deal_value).toLocaleString()}
        </p>
      )}
      {artifactCount > 0 && (
        <p className="mt-1">
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
            isSelected
              ? 'bg-white/20 text-white'
              : 'bg-rzs-red text-white'
          }`}>
            {artifactCount} artifact{artifactCount !== 1 ? 's' : ''}
          </span>
        </p>
      )}
    </button>
  );
}

function ZoneIcon({ zone }) {
  const colors = {
    red: 'bg-zone-red',
    green: 'bg-zone-green',
    yellow: 'bg-zone-yellow',
  };

  return <span className={`inline-block w-3 h-3 rounded-full ${colors[zone]}`} />;
}
