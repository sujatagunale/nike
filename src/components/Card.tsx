import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  category: string;
  price: number;
  image: string;
  colors?: number;
  badge?: string;
  href?: string;
}

export default function Card({
  title,
  category,
  price,
  image,
  colors = 1,
  badge,
  href,
}: CardProps) {
  const cardContent = (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg">
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-400 text-light-100 px-3 py-1 rounded-full font-jost text-caption font-medium">
              {badge}
            </span>
          </div>
        )}

        <div className="relative h-[390px] w-full rounded-lg overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <h3 className="font-jost text-body-medium font-medium text-dark-900 group-hover:text-dark-700">
            {title}
          </h3>
          <p className="font-jost text-caption text-dark-700">{category}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-jost text-body-medium font-medium text-dark-900">
            ${price.toFixed(2)}
          </p>

          {colors > 1 && (
            <p className="font-jost text-caption text-dark-700">
              {colors} Colour{colors !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} aria-label={title} className="block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
}
