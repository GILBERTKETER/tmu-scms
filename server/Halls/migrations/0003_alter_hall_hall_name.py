# Generated by Django 5.0.6 on 2024-10-28 14:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("Halls", "0002_hall_booked"),
    ]

    operations = [
        migrations.AlterField(
            model_name="hall",
            name="hall_name",
            field=models.CharField(max_length=100),
        ),
    ]
