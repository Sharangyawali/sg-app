export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;

  static get InjectableString(): string {
    return (
      this.name
        .replace(/(A-Z)/g, " $1")
        .replace(/entity/gi, "")
        .trim()
        .split(" ")
        .join("_")
        .toUpperCase() + "_REPOSITORY"
    );
  }
}
